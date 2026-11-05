# Integración Android nativa — etapa 1

Este directorio inicia la integración nativa que la interfaz web no puede realizar por sí sola.

## Incluido
- Manifiesto con el servicio NotificationListenerService.
- NotificationCaptureService.kt, limitado a notificaciones del paquete oficial de WhatsApp Business: com.whatsapp.w4b.
- El servicio entrega el remitente y el texto mediante un broadcast explícito dirigido a esta aplicación.

## Límites de esta etapa
- Todavía no hay proyecto Gradle completo, Activity anfitriona ni APK.
- El broadcast aún no está conectado con el motor web de conversación.
- No se envían respuestas y no se utiliza AccessibilityService.
- El contenido de la notificación solo se mantiene en memoria durante la entrega del evento; esta etapa no lo guarda en historial ni en la biblioteca de aprendizaje.
- El listener no puede garantizar que WhatsApp muestre siempre el texto completo o una acción de respuesta. Depende de la configuración de notificaciones y del formato que publique WhatsApp Business.

## Seguridad obligatoria antes de automatizar
1. Resolver el contacto y su grupo antes de procesar el texto.
2. Familiares y bloqueados: descartar el evento sin responder ni aprender.
3. Jefes: permitir únicamente el acuse configurado y detener la automatización.
4. Clientes: pasar el mensaje al motor local.
5. Números desconocidos: tratar como posibles clientes, pero no guardar ejemplos automáticamente.
6. Aprendizaje: solo ejemplos anonimizados y confirmados por el usuario; aprobación manual antes de incorporarlos.

## Siguiente trabajo técnico
- Crear el proyecto Gradle y la Activity anfitriona.
- Conectar este evento con la configuración local de contactos y el motor de conversación.
- Implementar respuesta con RemoteInput solo cuando la notificación incluya una acción compatible.
- Compilar, instalar y probar en un teléfono real antes de afirmar que responde automáticamente.
