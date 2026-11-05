(function(){
  const GRUPOS=["familiar","jefe","cliente","bloqueado"];
  function normaliza(){
    const c=RIStore.leer();
    if(!Array.isArray(c.contactos)) c.contactos=[];
    // Conserva las exclusiones creadas en la versión anterior como bloqueados.
    (c.exclusiones||[]).forEach(function(numero){
      if(!c.contactos.some(x=>x.numero===numero)) c.contactos.push({id:"legacy-"+numero,numero:numero,nombre:"",grupo:"bloqueado",creado:new Date().toISOString()});
    });
    c.exclusiones=[];
    RIStore.guardar(c);
    return c.contactos;
  }
  window.RIContactos={
    grupos:GRUPOS,
    listar:function(){return normaliza()},
    guardar:function(contacto){
      const lista=normaliza(), numero=String(contacto.numero||"").replace(/[^0-9+]/g,"");
      if(!numero) throw new Error("Escribe un número de teléfono.");
      if(!GRUPOS.includes(contacto.grupo)) throw new Error("Selecciona un grupo válido.");
      const existente=lista.find(x=>x.numero===numero);
      const item={id:existente?existente.id:"c-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),numero:numero,nombre:String(contacto.nombre||"").trim(),grupo:contacto.grupo,creado:existente?existente.creado:new Date().toISOString()};
      const nueva=existente?lista.map(x=>x.numero===numero?item:x):lista.concat(item);
      const c=RIStore.leer();c.contactos=nueva;c.exclusiones=nueva.filter(x=>x.grupo==="bloqueado").map(x=>x.numero);RIStore.guardar(c);return item;
    },
    eliminar:function(numero){
      const c=RIStore.leer();c.contactos=normaliza().filter(x=>x.numero!==numero);c.exclusiones=c.contactos.filter(x=>x.grupo==="bloqueado").map(x=>x.numero);RIStore.guardar(c);
    },
    clasificar:function(numero,grupo){
      const x=normaliza().find(x=>x.numero===numero);if(!x) throw new Error("No se encontró el contacto.");
      return this.guardar({numero:numero,nombre:x.nombre,grupo:grupo});
    },
    regla:function(numero){
      const x=normaliza().find(x=>x.numero===String(numero).replace(/[^0-9+]/g,""));
      if(!x) return {grupo:"posible_cliente",responder:true,nota:"Número nuevo: atender inicialmente como posible cliente."};
      if(x.grupo==="familiar"||x.grupo==="bloqueado") return {grupo:x.grupo,responder:false};
      if(x.grupo==="jefe") return {grupo:"jefe",responder:true,soloUnaVez:true};
      return {grupo:"cliente",responder:true};
    }
  };
})();