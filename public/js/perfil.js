const socket = io();

const ventana = document.getElementById("ventanaChat");
const menaje = document.getElementById("mensaje");
const enviar = document.getElementById("enviar");

// Declaramos objeto para request AJAX
let xhr = new XMLHttpRequest();

enviar.addEventListener("click",function(){
    socket.emit("miMensaje",{
        mensaje: mensaje.value
    });

    socket.on("mensajeServidor",function(dato){
       
        ventana.innerHTML += `<p>
            <strong> ${dato.usuario}</strong>:${dato.mensaje}
        </p>`
    });
});

/*
    <label for="usuario">Usuario:</label><br>
    <input type="text" name="usuario" placeholder="Ingrese usuario"> <br><br>

    const usuario = document.getElementById("usuario");
    usuario: usuario.value,
*/