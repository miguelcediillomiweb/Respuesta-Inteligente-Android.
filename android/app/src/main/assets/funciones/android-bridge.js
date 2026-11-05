(function(){
 var sessions={};
 var STORAGE_KEY="ri_inbox_v1";
 var seen={};
 function clean(v){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");}
 function readSaved(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");}catch(e){return [];}}
 function saveRecord(record){
  var items=readSaved();
  if(items.some(function(x){return x.id===record.id;}))return false;
  items.push(record);if(items.length>200)items=items.slice(-200);
  localStorage.setItem(STORAGE_KEY,JSON.stringify(items));return true;
 }
 function ensurePanel(){
  var panel=document.getElementById("riAndroidInbox");if(panel)return panel;
  panel=document.createElement("section");panel.id="riAndroidInbox";panel.className="panel";
  var h=document.createElement("h2");h.textContent="Bandeja de WhatsApp Business";
  var status=document.createElement("p");status.id="riAndroidStatus";status.textContent="Comprobando conexión con Android…";
  var summary=document.createElement("p");summary.id="riAndroidCount";summary.textContent="Mensajes guardados: 0";
  var list=document.createElement("div");list.id="riAndroidItems";
  panel.append(h,status,summary,list);
  var main=document.querySelector("main");if(main)main.insertBefore(panel,main.firstChild);
  return panel;
 }
 function updateCount(){var el=document.getElementById("riAndroidCount");if(el)el.textContent="Mensajes guardados en este teléfono: "+readSaved().length;}
 function setDiagnostic(connected){
  ensurePanel();var el=document.getElementById("riAndroidStatus");
  if(el)el.textContent=connected?"Servicio de notificaciones conectado con Android.":"Servicio sin confirmación de conexión. Android puede tardar en enlazar el servicio; revisa el diagnóstico después de recibir un aviso.";
 }
 function render(record){
  var list=ensurePanel().querySelector("#riAndroidItems");
  if(document.getElementById("ri-msg-"+encodeURIComponent(record.id)))return;
  var card=document.createElement("article");card.className="group-note";card.id="ri-msg-"+encodeURIComponent(record.id);
  var title=document.createElement("b");title.textContent=(record.group||"Mensaje recibido")+" · "+record.sender;
  var body=document.createElement("p");body.textContent=record.message;
  var time=document.createElement("small");time.textContent=record.receivedAt?new Date(record.receivedAt).toLocaleString():"Fecha no disponible";
  card.append(title,body,time);
  if(record.response){
   var answer=document.createElement("p");answer.textContent="Respuesta sugerida: "+record.response;card.append(answer);
   var copy=document.createElement("button");copy.className="save";copy.textContent="Copiar respuesta";
   copy.onclick=function(){var area=document.createElement("textarea");area.value=record.response;document.body.append(area);area.select();document.execCommand("copy");area.remove();copy.textContent="Copiada ✓";};
   card.append(copy);
  }
  list.prepend(card);updateCount();
 }
 function process(item){
  var sender=String(item.sender||"").trim(),message=String(item.message||"").trim();
  if(!sender||!message)return;
  var id=String(item.id||((sender+":"+message+":"+Date.now())));
  if(seen[id])return;seen[id]=true;
  var contacts=window.RIContactos?RIContactos.listar():[],key=clean(sender);
  var byName=contacts.filter(function(c){return clean(c.nombre)===key;});
  var match=byName.length===1?byName[0]:null;
  if(!match){var byNumber=contacts.filter(function(c){return c.numero&&clean(c.numero)===key;});match=byNumber.length===1?byNumber[0]:null;}
  var group="Remitente no clasificado · posible cliente",response="";
  if(match&&(match.grupo==="familiar"||match.grupo==="bloqueado")){
   group=match.grupo==="familiar"?"Familiar · sin respuesta":"Bloqueado · sin respuesta";
  }else if(window.RIPausa&&RIPausa.estaPausado()){
   group="Aplicación pausada · solo registro";
  }else if(match&&match.grupo==="jefe"){
   var today=new Date().toLocaleDateString("en-CA"),ackKey="ri_jefe_ack_"+clean(match.id||match.numero||match.nombre)+"_"+today;
   if(localStorage.getItem(ackKey))group="Jefe · acuse diario ya utilizado";
   else{localStorage.setItem(ackKey,"1");response="Recibido, estoy atento a lo que me indiques. 👌";group="Jefe · solo acuse sugerido";}
  }else if(window.RIConversacion){
   var sessionKey=match?match.id:sender,ctx=sessions[sessionKey]||RIConversacion.nueva();
   var result=RIConversacion.responder(message,ctx);sessions[sessionKey]=result.contexto;response=result.texto;
   group=match?(match.grupo==="cliente"?"Cliente":"Contacto clasificado"):"Remitente no clasificado · posible cliente";
  }
  var record={id:id,sender:sender,message:message,response:response,group:group,receivedAt:Number(item.receivedAt||Date.now())};
  saveRecord(record);render(record);
 }
 function restoreInbox(items){
  ensurePanel();
  var saved=readSaved();
  saved.forEach(function(x){seen[x.id]=true;render(x);});
  (Array.isArray(items)?items:[]).forEach(function(x){
   var id=String(x.id||"");if(!id||seen[id])return;
   process({id:id,sender:x.sender,message:x.message,receivedAt:x.receivedAt});
  });
  updateCount();
 }
 window.RIAndroid={
  onIncomingNotification:function(item){
   try{if(typeof item==="string")item=JSON.parse(item);process(item||{});}
   catch(e){console.error("RI notification:",e);var el=document.getElementById("riAndroidStatus");if(el)el.textContent="Error al procesar notificación: "+e.message;}
  },
  restoreInbox:restoreInbox,
  setDiagnostic:setDiagnostic
 };
 document.addEventListener("DOMContentLoaded",function(){ensurePanel();restoreInbox([]);});
})();