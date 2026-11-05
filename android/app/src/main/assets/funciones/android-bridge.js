(function(){
  var sessions = {};
  function clean(v){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");}
  function ensurePanel(){
    var panel=document.getElementById("riAndroidInbox");
    if(panel)return panel;
    panel=document.createElement("section");panel.id="riAndroidInbox";panel.className="panel";
    var h=document.createElement("h2");h.textContent="Mensajes recibidos en Android";
    var p=document.createElement("p");p.textContent="Aquí aparecen los avisos recibidos y las respuestas sugeridas. Debes revisarlas y enviarlas manualmente.";
    var list=document.createElement("div");list.id="riAndroidItems";
    panel.append(h,p,list);document.querySelector("main").insertBefore(panel,document.querySelector("main").firstChild);
    return panel;
  }
  function show(sender,message,response,group){
    var list=ensurePanel().querySelector("#riAndroidItems");
    var card=document.createElement("article");card.className="group-note";
    var title=document.createElement("b");title.textContent=group+" · "+sender;
    var body=document.createElement("p");body.textContent=message;
    card.append(title,body);
    if(response){var answer=document.createElement("p");answer.textContent="Respuesta sugerida: "+response;card.append(answer);
      var copy=document.createElement("button");copy.className="save";copy.textContent="Copiar respuesta";
      copy.onclick=function(){var area=document.createElement("textarea");area.value=response;document.body.append(area);area.select();document.execCommand("copy");area.remove();copy.textContent="Copiada ✓";};card.append(copy);}
    list.prepend(card);
  }
  function process(sender,message){
    var contacts=window.RIContactos?RIContactos.listar():[];
    var key=clean(sender);
    var match=contacts.find(function(c){return clean(c.nombre)===key || clean(c.numero)===key;});
    if(match && (match.grupo==="familiar" || match.grupo==="bloqueado")){show(sender,message,"",match.grupo==="familiar"?"Familiar: descartado":"Bloqueado: descartado");return;}
    if(window.RIPausa && RIPausa.estaPausado()){show(sender,message,"","Aplicación pausada");return;}
    if(match && match.grupo==="jefe"){show(sender,message,"Recibido, estoy atento a lo que me indiques. 👌","Jefe · solo acuse");return;}
    var ctx=sessions[sender] || RIConversacion.nueva();
    var result=RIConversacion.responder(message,ctx);sessions[sender]=result.contexto;
    show(sender,message,result.texto,match?"Cliente":"Número nuevo · posible cliente");
  }
  window.RIAndroid={onIncomingNotification:function(sender,message){try{process(String(sender||""),String(message||""));}catch(e){console.error(e);}}};
})();