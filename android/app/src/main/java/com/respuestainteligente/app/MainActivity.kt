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

class MainActivity : Activity() {
    private lateinit var page: WebView
    private var ready = false
    private var queued: Pair<String, String>? = null

    private val messages = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val sender = intent?.getStringExtra(NotificationCaptureService.EXTRA_SENDER) ?: return
            val body = intent.getStringExtra(NotificationCaptureService.EXTRA_MESSAGE) ?: return
            if (ready) showMessage(sender, body) else queued = sender to body
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val layout = LinearLayout(this)
        layout.orientation = LinearLayout.VERTICAL

        val top = LinearLayout(this)
        top.orientation = LinearLayout.HORIZONTAL
        val heading = TextView(this)
        heading.text = "Respuesta Inteligente"
        heading.textSize = 18f
        val settings = Button(this)
        settings.text = "Permisos"
        settings.setOnClickListener { startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)) }
        top.addView(heading, LinearLayout.LayoutParams(0, -2, 1f))
        top.addView(settings)
        layout.addView(top)

        page = WebView(this)
        page.settings.javaScriptEnabled = true
        page.settings.domStorageEnabled = true
        page.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                ready = true
                queued?.let { showMessage(it.first, it.second) }
                queued = null
            }
        }
        layout.addView(page, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(layout)
        page.loadUrl("file:///android_asset/index.html")

        val filter = IntentFilter(NotificationCaptureService.ACTION_INCOMING_MESSAGE)
        if (Build.VERSION.SDK_INT >= 33) registerReceiver(messages, filter, Context.RECEIVER_NOT_EXPORTED)
        else registerReceiver(messages, filter)
    }

    private fun showMessage(sender: String, body: String) {
        val s = android.util.Base64.encodeToString(sender.toByteArray(), android.util.Base64.NO_WRAP)
        val m = android.util.Base64.encodeToString(body.toByteArray(), android.util.Base64.NO_WRAP)
        page.post {
            page.evaluateJavascript(
                "window.RIAndroid && window.RIAndroid.onIncomingNotification(atob('$s'),atob('$m'));",
                null
            )
        }
    }

    override fun onDestroy() {
        try { unregisterReceiver(messages) } catch (_: Exception) {}
        if (::page.isInitialized) page.destroy()
        super.onDestroy()
    }
}
