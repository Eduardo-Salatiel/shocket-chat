var socket = io();

let params = new URLSearchParams(window.location.search);

if (!params.has("nombre") || !params.has('sala')) {
  window.location = "index.html";
  throw new Error("El nombre y sala son necesarios");
}

var usuario = { nombre: params.get("nombre"), sala: params.get("sala") };

socket.on("connect", function () {
  console.log("Conectado al servidor");

  socket.emit("entrarChat", usuario, function( resp ) {
      console.log(resp);
  });
});

// Enviar información
socket.on('crearMensaje', function( mensaje ){
    console.log('mensaje');
});

// socket.emit('crearMensaje', {
//     usuario: 'Eduardo',
//     mensaje: 'hola mundo',   
// }, function(resp){
//     console.log(resp);
// })
//ESCUCHAR CUNADO UN USUARIO ENTRA O SALE DEL CHAT
socket.on('listaPersonas', function(personas) {
    console.log(personas);
})

// escuchar
socket.on("disconnect", function () {
  console.log("Perdimos conexión con el servidor");
});


// Escuchar información
socket.on("enviarMensaje", function (mensaje) {
  console.log("Servidor:", mensaje);
});

//MENSAJE PRIVADOS
socket.on('mensajePrivado',function(mensaje){

    console.log("Mensaje PRivado", mensaje);
})
