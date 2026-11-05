# Flujo de atención

## Principio
La aplicación ayuda a atender mensajes entrantes y organizar casos. No sustituye las visitas, la preventa ni el trabajo de campo. No debe iniciar pedidos ni sugerir que el vendedor dejó de visitar a sus clientes.

## Grupos y prioridad de contactos
La clasificación será editable desde la aplicación y tendrá cuatro grupos:
- **Familiares:** exclusión total de respuestas automáticas. El usuario responde personalmente.
- **Jefes:** enviar una sola confirmación breve de recibido y atento; después, dejar la conversación para intervención manual.
- **Clientes:** permitir la atención automática conversacional y guardar el contexto de cada contacto.
- **Clientes bloqueados:** exclusión absoluta. Nunca enviarles respuestas automáticas.

Los números nuevos o no guardados se tratarán inicialmente como **posibles clientes**, para no perder una oportunidad de atención. Cuando el usuario identifique que es familiar, jefe o un contacto bloqueado, podrá clasificarlo y la regla correspondiente tendrá efecto en adelante. Las exclusiones de familiares y bloqueados prevalecen sobre cualquier otra configuración. Un contacto sin clasificar no se debe confundir con uno que el usuario haya marcado como bloqueado.

La aplicación no debe afirmar que puede leer la agenda, el nombre de perfil o el estado de bloqueo de WhatsApp hasta contar con la integración Android y los permisos/funciones que realmente lo permitan. El usuario podrá guardar al cliente con un nombre comercial propio, por ejemplo “Abarrotes Panchito”, aunque WhatsApp muestre el nombre de una persona.

## Saludo y personalización para clientes
En el primer mensaje de cada nueva conversación del día, usar saludo según la hora local (buenos días, buenas tardes o buenas noches), agradecer el contacto e incluir fecha y hora local de ese mensaje. Si el mismo cliente vuelve a escribir otro día, actualizar fecha, hora y saludo; no repetirlos innecesariamente en cada respuesta de la misma conversación.

Cuando exista un nombre comercial o nombre de contacto fiable, usarlo de manera natural. No tratar frases de estado, lemas, emojis o textos del perfil como si fueran nombres. Si el nombre no es fiable, saludar sin nombre. El nombre y la personalización no se aplican a familiares; para jefes basta la confirmación breve configurada.

Los mensajes deben sonar cálidos, sencillos y humanos, con emojis amistosos usados con moderación y pertinencia. Evitar frases rígidas, exceso de emojis, menús numerados y preguntas en serie que parezcan interrogatorio.

## Horario de clientes
- Lunes a sábado: 08:00 a 17:00.
- Domingo: mensaje de día no laborable.
- Fuera del horario: mensaje de fuera de horario.
- El usuario puede intervenir manualmente en cualquier conversación.

Mensaje de domingo de referencia:
"Gracias por escribir. Hoy no laboramos, pero podemos recibir tu mensaje. Cuéntame qué situación tienes y con gusto retomaremos la atención en cuanto regresemos. Mientras tanto, puedes consultar nuestro catálogo para conocer nuestras marcas."

El mensaje final y el enlace del catálogo serán editables por el usuario.

## Conversación orientada a necesidades
No mostrar menús numerados ni una lista fija de problemas. La conversación debe seguir el motivo real que menciona el cliente:
1. Leer el mensaje entrante y reconocer su intención.
2. Si falta contexto, hacer una sola pregunta breve y natural.
3. Usar la respuesta para precisar el caso sin repetir preguntas ya contestadas.
4. Reconocer el producto, servicio o incidencia que corresponda.
5. Confirmar lo entendido y guardar un resumen para que el usuario retome la conversación.

Temas internos para clasificar, nunca mostrados como menú:
- Reparto no realizado.
- Factura.
- Cobro incorrecto.
- Pedido incompleto.
- Producto dañado.
- Producto caducado.
- Enfriador con falla.
- Consulta de marcas, productos, presentaciones o disponibilidad.
- Otras consultas.

Ejemplo de consulta de producto: si preguntan por RC Cola, responder de forma amable con una descripción aprobada y preguntar qué información necesita. Si pregunta por presentaciones o solicita una foto, se podrá compartir una imagen del catálogo de productos cuando exista y la integración Android permita adjuntarla al mensaje. No enviar fotos automáticamente sin que sean pertinentes a la conversación. Las fotos o documentos solicitados por familiares o jefes quedan bajo control manual del usuario.

No inventar precios, inventario, presentaciones, promociones ni características. La información de cada producto deberá ser editable y validada por el usuario. No afirmar que se generó un pedido, visita, factura, devolución o solución si no fue confirmado por el vendedor.

## Intervención humana
La interfaz tendrá una acción clara para "Tomar conversación" y otra para reanudar la automatización de ese chat. Al tomarla, se pausa la respuesta automática para ese contacto. No prometer detección infalible de cada respuesta escrita manualmente dentro de WhatsApp: esa posibilidad depende de lo que Android exponga y de la compatibilidad de WhatsApp. Si no puede detectarse de forma fiable, el control manual dentro de la app será el mecanismo seguro.

## IA, privacidad y límites
Primera versión: flujo guiado por reglas y preguntas predefinidas, sin API ni cargos, con reconocimiento limitado por palabras y contexto guardado localmente. La naturalidad se logrará con variantes de redacción, contexto y reglas; no se debe presentar como IA generativa.
Una IA generativa más flexible normalmente requiere un servicio/modelo adicional; antes de integrarlo se debe informar si tiene costo, qué datos salen del teléfono y qué permisos necesita. No enviar conversaciones a terceros sin decisión explícita del usuario.

## Seguridad de automatización
No manipular la interfaz de WhatsApp con accesibilidad ni enviar mensajes masivos. La integración Android solo podrá responder si la notificación ofrece una acción de respuesta compatible y válida. Si no está disponible, dejar el mensaje para respuesta manual. La interfaz web de configuración por sí sola no puede leer mensajes, consultar el perfil de WhatsApp ni adjuntar imágenes en una conversación.
