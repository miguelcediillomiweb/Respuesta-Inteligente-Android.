# Integración Android — prototipo conectado

## Ya incluido
- Proyecto Gradle Kotlin con módulo Android.
- Activity que carga la interfaz local desde `app/src/main/assets/index.html`.
- Copia de los módulos web, estilos y motor local dentro de los assets Android.
- Servicio NotificationListenerService limitado a WhatsApp Business (`com.whatsapp.w4b`).
- Puente de eventos: la Activity recibe el broadcast y pasa remitente y texto al puente JavaScript.
- El motor local prepara una respuesta sugerida por conversación y mantiene el contexto mientras la Activity siga viva.
- Familiares y bloqueados coincidentes por nombre visible se descartan; jefes reciben un acuse sugerido una vez al día; clientes y números desconocidos generan una propuesta local.
- Las propuestas se muestran para revisión y copia manual. No se envían.

## Límites y seguridad
- La Activity debe estar abierta y viva para procesar el evento con el motor web. No se garantiza procesamiento si la app está cerrada o Android termina su proceso.
- WhatsApp no siempre expone el teléfono en la notificación. La clasificación actual compara el nombre visible con el nombre registrado; si no coincide, el remitente queda como número nuevo. Por eso la exclusión por nombre no es una garantía de identidad.
- Esta versión no utiliza RemoteInput y no manda respuestas automáticas.
- No se guardan automáticamente mensajes recibidos ni se incorporan al aprendizaje.
- El motor es local y basado en reglas, no una IA generativa.
- No se ha compilado ni probado en un dispositivo real; todavía no hay APK.

## Siguiente etapa
1. Probar recepción en un teléfono real y verificar formatos de notificación de WhatsApp Business.
2. Resolver identidad de contacto de forma fiable antes de habilitar cualquier envío.
3. Añadir una capa de respuesta con RemoteInput, solo cuando WhatsApp publique una acción compatible.
4. Añadir pruebas y generar el APK instalable.
