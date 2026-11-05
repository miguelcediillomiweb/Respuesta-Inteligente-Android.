package com.respuestainteligente.app

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(32, 48, 32, 48)
        }

        val title = TextView(this).apply {
            text = "Respuesta Inteligente"
            textSize = 26f
            gravity = Gravity.CENTER
        }

        val description = TextView(this).apply {
            text = "Etapa inicial de conexión con WhatsApp Business.\n\nActiva el acceso a notificaciones para permitir que Android entregue los avisos a la aplicación. Esta versión todavía no responde mensajes."
            textSize = 16f
            gravity = Gravity.CENTER
            setPadding(0, 24, 0, 24)
        }

        val accessButton = Button(this).apply {
            text = "Configurar acceso a notificaciones"
            setOnClickListener {
                startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS))
            }
        }

        layout.addView(title)
        layout.addView(description)
        layout.addView(accessButton)
        setContentView(layout)
    }
}
