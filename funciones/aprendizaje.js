(function(){
const KEY="ri_aprendizaje_v1";
function leer(){try{const x=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(x)?x:[]}catch(e){return []}}
function guardar(items){localStorage.setItem(KEY,JSON.stringify(items))}
function agregar(x){
 if(!x||x.confirmoCliente!==true) throw new Error("Solo se pueden guardar ejemplos confirmados como conversaciones de clientes.");
 const mensaje=String(x.mensaje||"").trim(),respuesta=String(x.respuesta||"").trim(),tema=String(x.tema||"otro").trim();
 if(!mensaje||!respuesta) throw new Error("Agrega el mensaje del cliente y la respuesta propuesta.");
 const item={id:"apr-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),tema,mensaje:mensaje.slice(0,1200),respuesta:respuesta.slice(0,1200),estado:"pendiente",fecha:new Date().toISOString()};
 const a=leer();a.unshift(item);guardar(a);return item;
}
function aprobar(id,edicion){const a=leer(),i=a.findIndex(x=>x.id===id);if(i<0)throw new Error("No se encontró el ejemplo.");if(edicion&&String(edicion).trim())a[i].respuesta=String(edicion).trim().slice(0,1200);a[i].estado="aprobado";a[i].aprobado=new Date().toISOString();guardar(a);return a[i]}
function eliminar(id){guardar(leer().filter(x=>x.id!==id))}
function resumen(){const a=leer(),pendientes=a.filter(x=>x.estado==="pendiente"),aprobados=a.filter(x=>x.estado==="aprobado"),grupos={};a.forEach(x=>{grupos[x.tema]=(grupos[x.tema]||0)+1});return {total:a.length,pendientes:pendientes.length,aprobados:aprobados.length,grupos,pendientes}}
window.RIAprendizaje={listar:leer,agregar,aprobar,eliminar,resumen};
})();