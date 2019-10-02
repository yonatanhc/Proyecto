const socket = io();

const ventana = document.getElementById("ventanaChat");
const menaje = document.getElementById("mensaje");
const enviar = document.getElementById("enviar");
const salir = document.getElementById("salir");
const micuenta = document.getElementById("miCuenta");

micuenta.classList.add("oculto");
salir.classList.toggle("oculto");

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

salir.addEventListener("click",function(){
    location = "/";
});