(function(){
const reglas=[
{tema:"entrega_no_realizada",nombre:"Pedido no entregado",patrones:[/no lleg[oó]/i,/no me entreg/i,/no vino/i,/no pas[oó]/i,/pedido.*pendiente/i,/no recib[ií]/i]},
{tema:"pedido_incompleto",nombre:"Pedido incompleto",patrones:[/falt[oó].*(producto|pedido|caja)/i,/pedido incompleto/i,/me faltan/i,/no ven[ií]a/i,/no incluyeron/i]},
{tema:"pedido",nombre:"Nuevo pedido",patrones:[/\bpedido\b/i,/me puede traer/i,/le encargo/i,/quiero (?:un )?pedido/i,/necesito (?:producto|refresco|agua)/i,/le pido/i]},
{tema:"facturacion",nombre:"Facturación",patrones:[/factur/i,/cfdi/i,/constancia fiscal/i,/datos fiscales/i,/rfc\b/i]},
{tema:"pago",nombre:"Formas de pago",patrones:[/forma[s]? de pago/i,/c[oó]mo puedo pagar/i,/aceptan tarjeta/i,/transferencia/i,/pago en efectivo/i]},
{tema:"cobro",nombre:"Cobro o importe",patrones:[/cobr(ar|aron|o).*(m[aá]s|doble|incorrecto)/i,/cobro/i,/me cobraron/i,/importe/i]},
{tema:"danado",nombre:"Producto dañado",patrones:[/dañad/i,/roto/i,/derramad/i,/mal estado/i,/golpead/i]},
{tema:"caducado",nombre:"Producto caducado",patrones:[/caducad/i,/vencid/i,/fecha de caducidad/i]},
{tema:"enfriador",nombre:"Enfriador o equipo",patrones:[/enfriador/i,/refrigerador/i,/no enfr[ií]a/i,/no funciona.*fr[ií]o/i,/equipo.*descompuesto/i]},
{tema:"vacaciones",nombre:"Vacaciones o cierre temporal",patrones:[/vacaciones/i,/saldr[eé].*d[ií]as/i,/estar[eé].*cerrad/i,/cerramos.*(semana|d[ií]as)/i]},
{tema:"cierre",nombre:"Cierre de negocio",patrones:[/voy a cerrar/i,/vamos a cerrar/i,/cierro definitivamente/i,/ya no voy a abrir/i,/bajo la cortina/i]},
{tema:"horario_especial",nombre:"Cambio de horario",patrones:[/abrir[eé].*tarde/i,/abrimos.*tarde/i,/cerrar[eé].*temprano/i,/cerramos.*temprano/i,/horario.*especial/i,/ma[ñn]ana.*(abro|abierto|cierro)/i]},
{tema:"comodato",nombre:"Mobiliario o equipo en comodato",patrones:[/comodato/i,/mobiliario/i,/recoger.*(equipo|enfriador|mueble)/i,/retirar.*(equipo|enfriador|mueble)/i,/equipo.*prestado/i]},
{tema:"producto",nombre:"Consulta de producto",patrones:[/precio/i,/cu[aá]nto cuesta/i,/presentaci[oó]n/i,/tienen .*producto/i,/informaci[oó]n.*producto/i,/manejan/i]}
];
const empatia=["Lamento el inconveniente. Con gusto le ayudamos a revisar qué ocurrió. 😊","Gracias por avisarnos; entendemos la molestia y queremos apoyarle. 🤝","Qué pena que esté pasando esto. Vamos a reunir los datos para darle seguimiento. 🙏"];
const elegir=(a,n)=>a[Math.abs(n||0)%a.length];
function detectar(t){return reglas.find(r=>r.patrones.some(p=>p.test(t)))||null}
function fechaHora(){const d=new Date();return {fecha:new Intl.DateTimeFormat("es-MX",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(d),hora:new Intl.DateTimeFormat("es-MX",{hour:"numeric",minute:"2-digit",hour12:true}).format(d).replace(/\.$/,"")}}
function prefijo(ctx){if(ctx.presentacionHecha)return "";const p=window.RIStore?RIStore.leer().perfil:{};const nombre=p.asistente||"asistente digital de tu preventa de zona Miguel";const fh=fechaHora();ctx.presentacionHecha=true;return "¡Qué tal! 👋 Soy el "+nombre+". Gracias por ponerte en contacto. 😊 Hoy es "+fh.fecha+" y son las "+fh.hora+". ¡Qué bueno que decidiste escribirnos! 📲\n\n"}
function responder(texto,ctx){
 const t=String(texto||"").trim(),c=ctx||{tema:"",etapa:0,datos:{},turno:0,presentacionHecha:false};c.datos=c.datos||{};const n=c.turno||0;
 if(!t)return {texto:"Cuéntame un poquito más para poder ayudarte. 😊",contexto:c,tema:c.tema||"otro",requiereHumano:false};
 if(/(demanda|abogado|profeco|denuncia|fraude|amenaz|quiero hablar con (un|el) (gerente|supervisor|encargado))/i.test(t))return salida("Comprendo. 🙏 Este asunto necesita atención directa de Miguel. Voy a dejarte una nota para que pueda revisarlo; no quiero prometerte una solución sin confirmarla. 🤝",c,"atencion_especial",true,n);
 let r=detectar(t);
 if(r&&(!c.tema||c.tema==="saludo"||c.tema==="otro"||r.tema!==c.tema||c.etapa>=3)){c.tema=r.tema;c.etapa=0;c.datos={};}
 if(!c.tema)c.tema="otro";
 const tema=c.tema,e=c.etapa||0;let out="",humano=false;const aprendido=window.RIAprendizaje&&window.RIAprendizaje.buscarRespuesta?window.RIAprendizaje.buscarRespuesta(tema,t):null;if(aprendido){c.turno=n+1;return {texto:prefijo(c)+aprendido.respuesta,contexto:c,tema,requiereHumano:true,origen:"biblioteca_aprobada"}}
 if(tema==="pedido"){
  if(e===0){c.datos.pedido=t;out="¡Claro que sí! 😊 Gracias por compartirnos su pedido. Le confirmo que su pedido ha sido agendado para nuestra entrega de mañana. 🚚 El equipo de reparto estará visitando su negocio en el transcurso del día, ya que no contamos con un horario exacto. Le pedimos estar pendiente de su entrega. 🙌\n\nSi necesita conocer el costo total, Miguel verificará los precios y cantidades antes de confirmárselos. 🧾";c.etapa=1;humano=true;}
  else{c.datos.detalle=t;out="¡Muchas gracias! 🙌 La forma de pago es efectivo contra entrega. 💵\n\nLa entrega habitual se realiza al día siguiente y el equipo de reparto visita los negocios durante el transcurso del día, sin horario exacto. La programación debe quedar confirmada por Miguel. 🚚";c.etapa=2;humano=true;}
 }else if(tema==="pago"){out="La forma de pago que manejamos es efectivo contra entrega. 💵😊";c.etapa=e+1;
 }else if(tema==="entrega_no_realizada"){if(e===0){out=elegir(empatia,n)+" ¿Qué productos esperaba recibir y para qué día estaba programada la entrega? 📦";c.etapa=1}else{c.datos.detalle=t;out="Gracias por confirmarnos. 🙌 ¿El negocio estuvo abierto durante el horario habitual o hubo algún cambio de horario ese día? Así podemos revisar el contexto de la entrega. 🕒";c.etapa=2;humano=true}
 }else if(tema==="pedido_incompleto"){if(e===0){out=elegir(empatia,n)+" ¿Qué productos y cantidades hicieron falta en su pedido? 📦";c.etapa=1}else{c.datos.detalle=t;out="Gracias, ya tenemos el detalle. 😊 ¿El resto de su pedido llegó correctamente?";c.etapa=2;humano=true}
 }else if(tema==="facturacion"){if(e===0){out="¡Con gusto le orientamos! 🧾 ¿Necesita factura de una compra o desea saber qué datos fiscales se requieren?";c.etapa=1}else{c.datos.detalle=t;out="Gracias por la información. 🙌 Para revisar la solicitud de facturación, Miguel debe confirmar los datos y el procedimiento correspondiente. No quiero indicarle que ya quedó emitida hasta tener confirmación. 🧾";c.etapa=2;humano=true}
 }else if(tema==="cobro"){if(e===0){out="Con gusto revisamos lo ocurrido. 🧾 ¿Qué cantidad aparece cobrada y cuál considera que debía ser?";c.etapa=1}else{c.datos.detalle=t;out="Gracias por el dato. 🙏 ¿Cuenta con el comprobante o factura para que Miguel pueda verificar el importe?";c.etapa=2;humano=true}
 }else if(tema==="danado"||tema==="caducado"){if(e===0){out=elegir(empatia,n)+" ¿Cuál es el producto, su presentación y cuántas piezas presentan el problema? 📦";c.etapa=1}else{c.datos.detalle=t;out="Muchas gracias. 🙌 ¿El problema se presentó en todas las piezas o solamente en algunas? Lo dejamos para revisión; no confirmaremos un cambio hasta verificarlo. 🤝";c.etapa=2;humano=true}
 }else if(tema==="enfriador"){if(e===0){out="Lamentamos el inconveniente con su enfriador. 🧊 ¿El equipo no enciende, no enfría o presenta otra falla?";c.etapa=1}else if(e===1){c.datos.falla=t;out="Gracias por explicarnos. 🙏 ¿Desde cuándo presenta esa falla y el enfriador pertenece al negocio o fue entregado en comodato? 🧊";c.etapa=2}else{c.datos.detalle=t;out="Entendido. ¿El equipo sigue en el establecimiento y está disponible para revisión o, si corresponde, para coordinar su recolección?";c.etapa=3;humano=true}
 }else if(tema==="vacaciones"||tema==="cierre"||tema==="horario_especial"){if(e===0){out="¡Gracias por avisarnos con anticipación! 😊 ¿Qué fechas y horarios estará cerrado o tendrá un horario diferente? 🗓️";c.etapa=1}else if(e===1){c.datos.fechas=t;out="Perfecto, tomamos nota. 🚚 ¿Tiene algún pedido pendiente o necesita ajustar la entrega antes de ese periodo?";c.etapa=2}else{c.datos.entrega=t;out="Gracias. 🙌 ¿En el negocio hay algún enfriador, exhibidor o mobiliario que se haya entregado en comodato o préstamo? Queremos revisar si hace falta coordinar algo antes del cierre. 🧊";c.etapa=3;humano=true}
 }else if(tema==="comodato"){if(e===0){out="Claro, podemos revisar ese tema. 🧊 ¿Qué equipo o mobiliario tiene en el negocio y se encuentra en comodato o préstamo?";c.etapa=1}else{c.datos.detalle=t;out="Gracias por la información. 🙏 ¿El equipo sigue en el establecimiento y en qué fecha sería conveniente coordinar una revisión o posible recolección? Miguel debe confirmar la gestión antes de comprometernos con una fecha. 📦";c.etapa=2;humano=true}
 }else if(tema==="producto"){if(e===0){out="¡Con mucho gusto! 😊 ¿De qué producto y presentación le gustaría conocer más?";c.etapa=1}else{c.datos.producto=t;out="Anotado: "+t+". 🙌 ¿Desea conocer presentación, disponibilidad o precio? Si requiere precio o total actualizado, lo revisa Miguel para evitar darle un dato incorrecto. 🧾";c.etapa=2;humano=true}
 }else{out=e===0?"¡Claro que sí! 😊 Cuéntame un poquito más, ¿qué necesitas o qué situación se presentó?":"Gracias por explicármelo. 🙌 ¿Qué sería lo más importante que resolvamos primero?";c.etapa=e+1}
 c.turno=n+1;const inicio=prefijo(c);return {texto:inicio+out,contexto:c,tema,requiereHumano:humano||!!c.requiereHumano};
}
function salida(texto,c,tema,humano,n){c.turno=n+1;return {texto:prefijo(c)+texto,contexto:c,tema,requiereHumano:humano}}
window.RIConversacion={responder,nueva(){return {tema:"",etapa:0,datos:{},turno:0,presentacionHecha:false}}};
})();