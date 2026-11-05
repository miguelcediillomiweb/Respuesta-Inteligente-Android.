(function(){
const KEY="ri_config_v1";
const base=()=>({pausado:true,respuestas:[],horario:{activo:false,inicio:"08:00",fin:"17:00",dias:[1,2,3,4,5,6]},exclusiones:[],perfil:{nombre:"",actividad:"",negocio:"",asistente:"asistente digital de tu preventa de zona Miguel",tono:"amigable",saludo:"¡Qué tal! 👋 Soy el asistente digital de tu preventa de zona Miguel. Gracias por ponerte en contacto. 😊 ¿En qué podemos ayudarte? 📲"}});
window.RIStore={
leer(){try{const guardado=JSON.parse(localStorage.getItem(KEY))||{};const d=base();return {...d,...guardado,horario:{...d.horario,...(guardado.horario||{})},perfil:{...d.perfil,...(guardado.perfil||{})},respuestas:Array.isArray(guardado.respuestas)?guardado.respuestas:[]}}catch(e){return base()}},
guardar(data){localStorage.setItem(KEY,JSON.stringify(data))}
};
})();