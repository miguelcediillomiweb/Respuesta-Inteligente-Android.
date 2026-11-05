package com.respuestainteligente.app

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import org.json.JSONObject

class MainActivity : Activity() {
    private lateinit var page: WebView
    private var ready = false
    private var queued = mutableListOf<JSONObject>()

    private val messages = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent == null) return
            val sender = intent.getStringExtra(NotificationCaptureService.EXTRA_SENDER) ?: return
            val body = intent.getStringExtra(NotificationCaptureService.EXTRA_MESSAGE) ?: return
            val item = JSONObject().apply {
                put("id", intent.getStringExtra(NotificationCaptureService.EXTRA_ID) ?: "${sender}:${System.currentTimeMillis()}")
                put("sender", sender)
                put("message", body)
                put("receivedAt", intent.getLongExtra(NotificationCaptureService.EXTRA_TIME, System.currentTimeMillis()))
            }
            if (ready) deliver(item) else queued.add(item)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val filter = IntentFilter(NotificationCaptureService.ACTION_INCOMING_MESSAGE)
        if (Build.VERSION.SDK_INT >= 33) registerReceiver(messages, filter, Context.RECEIVER_NOT_EXPORTED)
        else registerReceiver(messages, filter)

        val layout = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        val top = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        val heading = TextView(this).apply { text = "Respuesta Inteligente"; textSize = 18f }
        val settings = Button(this).apply {
            text = "Permisos"
            setOnClickListener { startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)) }
        }
        top.addView(heading, LinearLayout.LayoutParams(0, -2, 1f))
        top.addView(settings)
        layout.addView(top)

        page = WebView(this)
        page.settings.javaScriptEnabled = true
        page.settings.domStorageEnabled = true
        page.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                ready = true
                restoreInbox()
                queued.forEach { deliver(it) }
                queued.clear()
            }
        }
        layout.addView(page, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(layout)
        page.loadUrl("file:///android_asset/index.html")
    }

    private fun restoreInbox() {
        val prefs = getSharedPreferences(NotificationCaptureService.PREFS, MODE_PRIVATE)
        val items = prefs.getString(NotificationCaptureService.KEY_ITEMS, "[]") ?: "[]"
        val connected = prefs.getBoolean(NotificationCaptureService.KEY_SERVICE_CONNECTED, false)
        val safeItems = JSONObject.quote(items)
        page.evaluateJavascript(
            "if(window.RIAndroid){window.RIAndroid.restoreInbox(JSON.parse($safeItems));window.RIAndroid.setDiagnostic($connected);}",
            null
        )
    }

    private fun deliver(item: JSONObject) {
        val safe = JSONObject.quote(item.toString())
        page.post {
            page.evaluateJavascript(
                "if(window.RIAndroid){window.RIAndroid.onIncomingNotification(JSON.parse($safe));}",
                null
            )
        }
    }

    override fun onResume() {
        super.onResume()
        if (::page.isInitialized && ready) restoreInbox()
    }

    override fun onDestroy() {
        try { unregisterReceiver(messages) } catch (_: Exception) {}
        if (::page.isInitialized) page.destroy()
        super.onDestroy()
    }
}
