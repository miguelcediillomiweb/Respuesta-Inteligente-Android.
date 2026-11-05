(function(){
const reglas=[
{tema:"entrega_no_realizada",nombre:"Pedido no entregado",patrones:[/no lleg[oó]/i,/no me entreg/i,/no vino/i,/no pas[oó]/i,/pedido.*pendiente/i,/no recib[ií]/i]},
{tema:"pedido_incompleto",nombre:"Pedido incompleto",patrones:[/falt[oó].*(producto|pedido|caja)/i,/pedido incompleto/i,/me faltan/i,/no ven[ií]a/i,/no incluyeron/i]},
{tema:"cobro",nombre:"Cobro o factura",patrones:[/cobr(ar|aron|o).*(m[aá]s|doble|incorrecto)/i,/cobro/i,/me cobraron/i,/factura/i,/importe/i]},
{tema:"danado",nombre:"Producto dañado",patrones:[/dañad/i,/roto/i,/derramad/i,/mal estado/i,/golpead/i]},
{tema:"caducado",nombre:"Producto caducado",patrones:[/caducad/i,/vencid/i,/fecha de caducidad/i]},
{tema:"enfriador",nombre:"Enfriador",patrones:[/enfriador/i,/refrigerador/i,/no enfr[ií]a/i,/no funciona.*fr[ií]o/i]},
{tema:"producto",nombre:"Consulta de producto",patrones:[/precio/i,/cu[aá]nto cuesta/i,/presentaci[oó]n/i,/tienen .*producto/i,/informaci[oó]n.*producto/i,/manejan/i]}
];
const variaciones={
empatia:["Lamento mucho lo que nos comenta. Entiendo que esta situación le cause molestias y con gusto vamos a revisar qué ocurrió.","Qué pena que haya pasado esto. Gracias por avisarnos; vamos a revisar su caso para orientarle de la mejor manera.","Entiendo su inconformidad y le ofrecemos una disculpa por el inconveniente. Permítame ayudarle a reunir la información."],
cierre:["Gracias por compartirnos esos datos. Queremos encontrar la mejor manera de apoyarle.","Le agradezco que nos lo explique. Con esta información podremos darle mejor seguimiento.","Muchas gracias por su paciencia. Vamos paso a paso para revisar su situación."]
};
function elegir(a,semilla){return a[Math.abs(semilla||0)%a.length]}
function clasificar(t){return reglas.find(r=>r.patrones.some(p=>p.test(t)))||null}
function respuesta(texto,ctx){
const t=String(texto||"").trim(),c=ctx||{tema:"",etapa:0,datos:{},turno:0};
if(!t)return {texto:"Cuénteme un poco más para poder orientarle.",contexto:c,tema:c.tema||"sin_identificar",requiereHumano:false};
const bajo=t.toLowerCase(),n=c.turno||0;
if(/(demanda|abogado|profeco|denuncia|fraude|amenaz|quiero hablar con (un|el) (gerente|supervisor|encargado))/i.test(bajo)){
return {texto:"Comprendo. Para atenderlo correctamente, voy a dejar este asunto para revisión directa de una persona de nuestro equipo. ¿Me permite compartirle lo que nos ha comentado para que le den seguimiento?",contexto:{...c,turno:n+1,requiereHumano:true},tema:c.tema||"atencion_especial",requiereHumano:true};
}
let r=clasificar(t);
if(r&&(!c.tema||c.tema==="saludo"||c.tema==="otro")){c.tema=r.tema;c.etapa=0;c.datos=c.datos||{};}
if(!c.tema){
if(/^(hola|buenos d[ií]as|buenas tardes|buenas noches|buenas)$/i.test(bajo)||/^(hola|buenos d[ií]as|buenas tardes|buenas noches)[!. ]*$/i.test(bajo)){
const h=new Date().getHours(),saludo=h<12?"¡Muy buenos días!":h<19?"¡Muy buenas tardes!":"¡Muy buenas noches!";
const perfil=window.RIStore?RIStore.leer().perfil:{};
const negocio=perfil.negocio?" de "+perfil.negocio:"";
return {texto:saludo+" Gracias por comunicarse"+negocio+". Estamos a sus órdenes 😊 Cuénteme, ¿en qué podemos ayudarle el día de hoy?",contexto:{tema:"saludo",etapa:0,datos:{},turno:n+1},tema:"saludo",requiereHumano:false};
}
c.tema="otro";c.etapa=0;c.datos={};
}
const tema=c.tema,etapa=c.etapa||0;
let out="";
if(tema==="entrega_no_realizada"){
if(etapa===0){out=elegir(variaciones.empatia,n)+" Para revisar qué sucedió, ¿nos confirma qué productos esperaba recibir y de qué día era su entrega?";c.etapa=1;}
else if(etapa===1){c.datos.detalle=t;out="Muchas gracias por confirmarnos. ¿Lo que busca es que revisemos una nueva entrega de esos productos, o hubo algún otro detalle que también debamos considerar?";c.etapa=2;}
else if(etapa===2){c.datos.preferencia=t;out="Claro, tomamos nota de lo que necesita: "+t+". ¿Hay algún producto adicional que quisiera incluir o por ahora revisamos únicamente lo que quedó pendiente?";c.etapa=3;}
else{c.datos.adicional=t;out=elegir(variaciones.cierre,n)+" Ya tenemos la información para que su preventa de zona revise el caso. No le confirmaremos una entrega hasta verificarla con el equipo.";c.etapa=4;c.requiereHumano=true;}
}else if(tema==="pedido_incompleto"){
if(etapa===0){out=elegir(variaciones.empatia,n)+" ¿Nos puede indicar qué productos y cantidades no llegaron en su pedido?";c.etapa=1;}
else{c.datos.detalle=t;out="Gracias, ya anotamos lo que nos indica: "+t+". ¿El resto de su pedido sí llegó correctamente o hubo algún otro faltante?";c.etapa=2;}
}else if(tema==="cobro"){
if(etapa===0){out="Con gusto revisamos lo ocurrido. Para entender bien el cobro, ¿nos indica qué cantidad aparece cobrada y cuál considera que debía ser?";c.etapa=1;}
else{c.datos.detalle=t;out="Gracias por el dato. ¿Cuenta con el comprobante o factura donde podamos revisar ese importe? Si gusta, puede compartirlo para que nuestro equipo lo verifique.";c.etapa=2;c.requiereHumano=true;}
}else if(tema==="danado"||tema==="caducado"){
if(etapa===0){out=elegir(variaciones.empatia,n)+" ¿Nos comparte el nombre del producto, la presentación y cuántas piezas presentan ese problema?";c.etapa=1;}
else{c.datos.detalle=t;out="Muchas gracias. ¿El problema se presentó en todas las piezas o solamente en algunas? Con esos datos podemos canalizar el reporte para su revisión.";c.etapa=2;c.requiereHumano=true;}
}else if(tema==="enfriador"){
if(etapa===0){out="Lamentamos el inconveniente con su enfriador. Para orientarle, ¿nos cuenta qué sucede exactamente: no enciende, no enfría o presenta alguna otra falla?";c.etapa=1;}
else{c.datos.detalle=t;out="Entendido, gracias por explicarnos. ¿Desde cuándo presenta esa falla? Voy a dejar la información lista para que el equipo correspondiente la revise.";c.etapa=2;c.requiereHumano=true;}
}else if(tema==="producto"){
if(etapa===0){out="Con mucho gusto le compartimos información. ¿De qué producto o presentación le gustaría conocer más?";c.etapa=1;}
else{c.datos.producto=t;out="Claro, tomo nota de su interés en "+t+". ¿Qué le gustaría saber: presentaciones disponibles, características o alguna otra información?";c.etapa=2;}
}else{
out=etapa===0?"Claro que sí, con gusto le apoyamos. Para entender bien lo que necesita, ¿me puede contar un poquito más sobre lo que sucedió o la información que está buscando?":"Gracias por explicármelo. Quiero asegurarme de entenderle bien: ¿qué sería lo más importante que resolvamos primero?";
c.etapa=etapa+1;
}
c.turno=n+1;
return {texto:out,contexto:c,tema:tema,requiereHumano:!!c.requiereHumano};
}
window.RIConversacion={responder:respuesta,nueva(){return {tema:"",etapa:0,datos:{},turno:0}}};
})();