package com.respuestainteligente.app

import android.app.Notification
import android.content.Intent
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification

/**
 * Primera etapa nativa: detecta notificaciones de WhatsApp Business.
 *
 * Privacidad por diseño:
 * - No guarda mensajes, nombres ni teléfonos.
 * - No responde ni pulsa acciones de WhatsApp.
 * - Solo entrega el contenido en memoria a un receptor interno de la app.
 * - La clasificación de contactos y las exclusiones deben ejecutarse antes
 *   de cualquier aprendizaje o respuesta automática.
 *
 * La respuesta mediante RemoteInput se implementará después de integrar
 * la configuración de contactos y probar la acción real en el dispositivo.
 */
class NotificationCaptureService : NotificationListenerService() {

    companion object {
        const val ACTION_INCOMING_MESSAGE =
            "com.respuestainteligente.app.ACTION_INCOMING_MESSAGE"
        const val EXTRA_PACKAGE = "source_package"
        const val EXTRA_SENDER = "sender"
        const val EXTRA_MESSAGE = "message"

        private const val WHATSAPP_BUSINESS = "com.whatsapp.w4b"
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        if (sbn == null || sbn.packageName != WHATSAPP_BUSINESS) return

        val extras = sbn.notification?.extras ?: return
        val sender = extras.getCharSequence(Notification.EXTRA_TITLE)
            ?.toString()?.trim().orEmpty()
        val message = extras.getCharSequence(Notification.EXTRA_TEXT)
            ?.toString()?.trim().orEmpty()

        if (sender.isBlank() || message.isBlank()) return
        if (sender.equals("WhatsApp Business", ignoreCase = true)) return

        val event = Intent(ACTION_INCOMING_MESSAGE).apply {
            setPackage(packageName)
            putExtra(EXTRA_PACKAGE, sbn.packageName)
            putExtra(EXTRA_SENDER, sender)
            putExtra(EXTRA_MESSAGE, message)
        }
        sendBroadcast(event)
    }
}
