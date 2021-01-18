const { io } = require("../server");
const Usuarios = require("./../classes/usuarios");
const { crearMensaje } = require("./../utils/utilidades");

const usuarios = new Usuarios();

io.on("connection", (client) => {
  client.on("entrarChat", (usuario, callback) => {
    if (!usuario.nombre || !usuario.sala) {
      return callback({
        err: true,
        mensaje: "El nombre/sala es necesario",
      });
    }

    client.join(usuario.sala);

    usuarios.agregarPersona(
      client.id,
      usuario.nombre,
      usuario.sala
    );

    client.broadcast
      .to(usuario.sala)
      .emit("listaPersonas", usuarios.getPersonasPorSalas(usuario.sala));
    callback(usuarios.getPersonasPorSalas(usuario.sala));
  });

  client.on("disconnect", () => {
    let personaBorrada = usuarios.borrarPersona(client.id);

    client.broadcast
      .to(personaBorrada.sala)
      .emit(
        "crearMensaje",
        crearMensaje("Administrador", `${personaBorrada.nombre} salio`)
      );

    client.broadcast
      .to(personaBorrada.sala)
      .emit("listaPersonas", usuarios.getPersonasPorSalas(personaBorrada.sala));
  });

  client.on("crearMensaje", (data, callback) => {
    let persona = usuarios.getPersona(client.id);
    let mensaje = crearMensaje(persona.nombre, data.mensaje);

    client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);

    callback(mensaje)
  });

  client.on("mensajePrivado", (data) => {
    let persona = usuarios.getPersona(client.id);

    client.broadcast
      .to(data.para)
      .emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje));
  });
});
