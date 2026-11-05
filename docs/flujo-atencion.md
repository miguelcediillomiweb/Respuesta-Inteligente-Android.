# Flujo de atención

## Principio
La aplicación ayuda a atender mensajes entrantes y organizar casos. No sustituye las visitas, la preventa ni el trabajo de campo. No debe iniciar pedidos ni sugerir que el vendedor dejó de visitar a sus clientes.

## Clasificación de contactos
Cada contacto debe pertenecer a una categoría elegida por el usuario:
- Personal: nunca responder automáticamente.
- Oficina: enviar únicamente una confirmación breve y dejar la conversación para atención manual.
- Cliente: permitir el flujo de atención automática.
- Sin clasificar: no enviar respuestas automáticas.

La clasificación debe ser editable desde la interfaz. Las exclusiones personales tienen prioridad sobre cualquier otra regla.

## Horario de clientes
- Lunes a sábado: 08:00 a 17:00.
- Domingo: mensaje de día no laborable.
- Fuera del horario: mensaje de fuera de horario.
- El usuario puede intervenir manualmente en cualquier conversación.

Mensaje de domingo de referencia:
"Gracias por escribir. Hoy no laboramos, pero podemos recibir tu mensaje. Cuéntame qué situación tienes y con gusto retomaremos la atención en cuanto regresemos. Mientras tanto, puedes consultar nuestro catálogo para conocer nuestras marcas."

El mensaje final y el enlace del catálogo serán editables por el usuario.

## Indagación conversacional
No mostrar menús numerados ni una lista fija de problemas. El asistente debe:
1. Leer el mensaje entrante.
2. Reconocer si ya se entiende la necesidad.
3. Si falta contexto, hacer una sola pregunta breve y natural.
4. Usar la respuesta para precisar el caso.
5. Confirmar lo entendido y guardar un resumen.
6. Si no entiende, hay molestia, riesgo o hace falta una decisión humana, avisar al vendedor y detener la indagación automática.

Posibles temas internos para clasificar, nunca mostrados como menú:
- Reparto no realizado.
- Factura.
- Cobro incorrecto.
- Pedido incompleto.
- Producto dañado.
- Producto caducado.
- Enfriador con falla.
- Otra consulta.

No afirmar que se generó un pedido, visita, factura, devolución o solución si no fue confirmado por el vendedor.

## Intervención humana
El vendedor puede tomar la conversación en cualquier momento. Al detectar una respuesta manual del vendedor, el sistema debe pausar las respuestas automáticas para ese chat durante un periodo configurable o hasta que el vendedor reactive la atención. No competir con mensajes humanos.

## IA y privacidad
Primera versión: flujo guiado por reglas y preguntas predefinidas, sin API ni cargos, con reconocimiento limitado por palabras y contexto guardado localmente.
Una IA generativa más flexible normalmente requiere un servicio/modelo adicional; antes de integrarlo se debe informar si tiene costo, qué datos salen del teléfono y qué permisos necesita. No enviar conversaciones a terceros sin decisión explícita del usuario.

## Seguridad de automatización
No manipular la interfaz de WhatsApp con accesibilidad ni enviar mensajes masivos. La integración Android solo podrá responder si la notificación ofrece una acción de respuesta compatible y válida. Si no está disponible, dejar el mensaje para respuesta manual.
