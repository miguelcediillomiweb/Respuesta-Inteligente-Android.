package com.respuestainteligente.app

import android.app.Notification
import android.content.Intent
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import org.json.JSONArray
import org.json.JSONObject

/**
 * Captura notificaciones visibles de WhatsApp Business.
 * Guarda una bandeja local limitada (200 avisos) y emite un evento a la UI.
 * No envía respuestas ni transmite datos fuera del dispositivo.
 */
class NotificationCaptureService : NotificationListenerService() {
    companion object {
        const val ACTION_INCOMING_MESSAGE = "com.respuestainteligente.app.ACTION_INCOMING_MESSAGE"
        const val EXTRA_PACKAGE = "source_package"
        const val EXTRA_SENDER = "sender"
        const val EXTRA_MESSAGE = "message"
        const val EXTRA_ID = "notification_id"
        const val EXTRA_TIME = "received_at"
        const val PREFS = "ri_notification_inbox"
        const val KEY_ITEMS = "items"
        const val KEY_SERVICE_CONNECTED = "service_connected"
        private const val WHATSAPP_BUSINESS = "com.whatsapp.w4b"
        private const val MAX_ITEMS = 200
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        getSharedPreferences(PREFS, MODE_PRIVATE).edit()
            .putBoolean(KEY_SERVICE_CONNECTED, true).apply()
    }

    override fun onListenerDisconnected() {
        getSharedPreferences(PREFS, MODE_PRIVATE).edit()
            .putBoolean(KEY_SERVICE_CONNECTED, false).apply()
        super.onListenerDisconnected()
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        if (sbn == null || sbn.packageName != WHATSAPP_BUSINESS) return
        val notification = sbn.notification ?: return
        val extras = notification.extras ?: return

        var sender = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString()?.trim().orEmpty()
        var message = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString()?.trim().orEmpty()

        // Algunas versiones de Android/WhatsApp exponen mensajes como líneas.
        if (message.isBlank()) {
            val lines = extras.getCharSequenceArray(Notification.EXTRA_TEXT_LINES)
            if (!lines.isNullOrEmpty()) message = lines.joinToString("\n") { it.toString() }.trim()
        }
        if (sender.isBlank() || message.isBlank()) return
        if (sender.equals("WhatsApp Business", ignoreCase = true) ||
            sender.equals("WhatsApp", ignoreCase = true)) return

        val receivedAt = sbn.postTime
        val id = "${sbn.key}:${receivedAt}"
        val item = JSONObject().apply {
            put("id", id)
            put("sender", sender)
            put("message", message)
            put("receivedAt", receivedAt)
        }

        val prefs = getSharedPreferences(PREFS, MODE_PRIVATE)
        synchronized(this) {
            val old = try { JSONArray(prefs.getString(KEY_ITEMS, "[]")) } catch (_: Exception) { JSONArray() }
            val updated = JSONArray()
            for (i in 0 until old.length()) {
                val existing = old.optJSONObject(i) ?: continue
                if (existing.optString("id") != id) updated.put(existing)
            }
            updated.put(item)
            val trimmed = JSONArray()
            val start = (updated.length() - MAX_ITEMS).coerceAtLeast(0)
            for (i in start until updated.length()) trimmed.put(updated.getJSONObject(i))
            prefs.edit().putString(KEY_ITEMS, trimmed.toString()).apply()
        }

        val event = Intent(ACTION_INCOMING_MESSAGE).apply {
            setPackage(packageName)
            putExtra(EXTRA_PACKAGE, sbn.packageName)
            putExtra(EXTRA_SENDER, sender)
            putExtra(EXTRA_MESSAGE, message)
            putExtra(EXTRA_ID, id)
            putExtra(EXTRA_TIME, receivedAt)
        }
        sendBroadcast(event)
    }
}
