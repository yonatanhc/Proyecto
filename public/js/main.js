const buscador = document.getElementById("buscador");
const buttonBuscador = document.getElementById("buttonBuscador");
const cuenta = document.getElementById("miCuenta");


cuenta.onclick= function(){
    location = '/login';
}

buttonBuscador.onclick = function(){
    let url = "/buscar?"
    let buscar = document.getElementById("buscador").value;
    if (buscar) {
        url += "buscar=" + buscar;
    }
    location = url;
}