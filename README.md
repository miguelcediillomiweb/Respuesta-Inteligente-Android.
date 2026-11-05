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

## Estado real y limitaciones
La interfaz web permite configurar perfil, respuestas, horarios, contactos, probar el motor y administrar ejemplos locales. Todavía no existe integración Android con WhatsApp: no lee notificaciones ni envía respuestas automáticas. Tampoco se ha generado un APK instalable. El motor actual es basado en reglas; no es una IA generativa conectada a un modelo, y sus propuestas deben revisarse.

## Estructura
- `index.html`: pantalla principal.
- `css/`: estilos.
- `js/`: inicio de la aplicación.
- `funciones/`: módulos independientes, incluido `conversacion.js` y `aprendizaje.js`.
- `android/`: integración nativa futura.
