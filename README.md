# Respuesta Inteligente

Aplicación configurable para organizar la atención de mensajes entrantes de WhatsApp Business.

## Personalización
- Cada instalación guarda su perfil y ajustes localmente en su propio dispositivo.
- Se pueden cambiar nombre, negocio, actividad, tono y presentación del asistente.
- Las respuestas se pueden crear, editar y eliminar desde la pantalla, sin tocar código.
- Los contactos y horarios se configuran por separado en cada dispositivo.

## Motor de conversación
- Presentación de primer contacto configurable, con fecha y hora local.
- Reconocimiento inicial de pedidos, entregas no realizadas o incompletas, facturación, pagos, cobros, productos dañados/caducados, enfriadores, vacaciones, cierres, cambios de horario y equipos/mobiliario en comodato.
- Informa que la forma de pago es efectivo contra entrega.
- La plantilla de pedido indica entrega al día siguiente durante el transcurso del día, sin prometer una hora exacta.
- No calcula precios ni inventa existencias; los precios y totales quedan para revisión humana.
- Conserva el contexto de la conversación y deriva situaciones sensibles o que requieren confirmación a una persona.

## Biblioteca de aprendizaje
- Los ejemplos se agregan manualmente y requieren confirmar que son exclusivamente de clientes.
- Se recomienda anonimizar mensajes: no guardar nombres, teléfonos, direcciones, RFC ni datos personales.
- Los ejemplos se guardan localmente en el dispositivo, con estado pendiente o aprobado.
- Las respuestas propuestas requieren aprobación antes de formar parte de los ejemplos aprobados.
- La pantalla muestra un resumen de los ejemplos de los últimos siete días.
- No captura notificaciones reales ni importa chats de WhatsApp.

## Integración Android — prototipo conectado
- La carpeta `android/` contiene un proyecto Android inicial con Gradle/Kotlin.
- La Activity abre la interfaz local incluida en `android/app/src/main/assets/`.
- El servicio nativo escucha notificaciones del paquete WhatsApp Business (`com.whatsapp.w4b`) y, cuando la Activity está abierta, entrega remitente y texto a la interfaz.
- El puente consulta los contactos configurados: familiares y bloqueados se descartan; jefes reciben un acuse sugerido como máximo una vez al día; clientes y números desconocidos pasan al motor local para preparar una respuesta.
- Las respuestas se muestran como sugerencias para revisar y copiar. **No se envían automáticamente.**
- La clasificación usa el nombre visible de la notificación; Android/WhatsApp no siempre proporciona el teléfono. Por eso no se puede garantizar que el nombre visible coincida con el contacto guardado. Revisa las clasificaciones y no actives automatización de envío con esta versión.
- Los mensajes recibidos no se incorporan automáticamente a la biblioteca de aprendizaje.

## Estado real y limitaciones
El puente entre el servicio nativo y el motor local está implementado para la Activity abierta. Si la aplicación se cierra o Android termina su proceso, esta versión no garantiza que el mensaje llegue al motor. Tampoco implementa todavía respuesta mediante RemoteInput, ni se ha generado o probado un APK en un teléfono. El motor es basado en reglas; no es una IA generativa y sus propuestas deben revisarse.

## Estructura
- `index.html`: pantalla principal.
- `css/`: estilos.
- `js/`: inicio de la aplicación.
- `funciones/`: módulos independientes, incluido `conversacion.js` y `aprendizaje.js`.
- `android/`: integración nativa futura.
