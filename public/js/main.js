const buscador = document.getElementById("buscador");
const buttonBuscador = document.getElementById("buttonBuscador");
const cuenta = document.getElementById("miCuenta");
const inicio = document.getElementById("inicio");

cuenta.onclick= function(){
    location = '/iniciarSesion';
}

buttonBuscador.onclick = function(){
    let url = "/buscar?"
    let buscar = document.getElementById("buscador").value;
    if (buscar) {
        url += "buscar=" + buscar;
    }
    location = url;
}

inicio.onclick = function(){
    location = '/';
}