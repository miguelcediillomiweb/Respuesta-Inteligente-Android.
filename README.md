# Respuesta Inteligente

Aplicacion configurable para organizar la atencion de mensajes entrantes de WhatsApp Business.

## Personalizacion
- Cada instalacion guarda su perfil y ajustes localmente en su propio dispositivo.
- Se pueden cambiar nombre, negocio, actividad, tono y saludo inicial.
- Las respuestas se pueden crear, editar y eliminar desde la pantalla, sin tocar codigo.
- Los contactos y horarios se configuran por separado en cada dispositivo.

## Estado real
La interfaz web permite configurar perfil, respuestas, horarios y contactos. Todavia no existe integracion Android con WhatsApp: no lee notificaciones ni envia respuestas automaticas. Tampoco se ha generado un APK instalable.

## Estructura
- `index.html`: pantalla principal.
- `css/`: estilos.
- `js/`: inicio de la aplicacion.
- `funciones/`: modulos independientes, incluido `conversacion.js` para detectar situaciones y proponer respuestas contextuales.
- `android/`: integracion nativa futura.
