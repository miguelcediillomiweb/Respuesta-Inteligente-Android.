# Respuesta Inteligente

Aplicación personal para organizar respuestas automáticas a mensajes entrantes de WhatsApp Business.

## Principios
- Interfaz sencilla, con botones y configuraciones por selección.
- Proyecto modular: cada función vive en su propio archivo.
- Procesamiento local siempre que sea posible.
- Sin campañas, envíos masivos, precios ni mensajes salientes no solicitados.
- No manipular la interfaz de WhatsApp mediante accesibilidad.
- La integración Android solo responderá cuando exista una acción de respuesta compatible y válida en la notificación.

## Estructura
- `index.html`: pantalla principal.
- `css/`: estilos visuales.
- `js/`: inicio, configuración y almacenamiento.
- `funciones/`: módulos independientes.
- `android/`: integración nativa futura.
- `.github/workflows/`: compilación futura del APK.

## Estado
Base inicial. La interfaz web sirve para configurar y probar la experiencia; la automatización real de notificaciones requiere integración Android nativa y permisos del sistema.
