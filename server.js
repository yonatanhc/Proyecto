const express = require("express");
const path = require("path");
const fs = require('fs');
const exphbs = require('express-handlebars');
const socketio = require("socket.io");
const app = express();

const bodyParser = require('body-parser');


// Parser para interpretar datos  en el body de un request
app.use(bodyParser.urlencoded({ extended: true }));

// Path de base de recursos estáticos (archivos linkeados en htmls)
app.use(express.static(path.join(__dirname, '/public')));

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layout')
}));
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'));

app.get("/",(req,res)=>{
    res.render('home');
});

app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,'public/html/login.html'));
});

app.get("/registrarse",(req,res)=>{
    res.sendFile(path.join(__dirname,'public/html/crearCuenta.html'));
});


app.post('/sesion',(req,res)=>{
    validarDatos(
        req,
        () => res.sendFile(path.join(__dirname,'public/html/crearCuenta.html')),
        () => ingresarPerfil(req,res));
});

const server = app.listen(3000,()=>{
    console.log("corriendo en el puerto 3000...");
});

function validarDatos(datos,err,ok){
    fs.readFile(path.join(__dirname, "usuario.json"), (error, data) => {
        if(!error){
            let usuarios = JSON.parse(data)
            let coincidencia = usuarios.some((valor)=>{
                return (valor.usuario == datos.body.usuario && valor.contraseña == datos.body.contraseña)
            });
            if(coincidencia) ok();
            else err();
        }
    });
 
}

function ingresarPerfil(req,res){
    res.sendFile(path.join(__dirname,'public/html/perfil.html'));;
    const io = socketio(server);

    io.on('connection',(socket)=>{
        console.log("conectado");
        socket.on("miMensaje",(dato)=>{
            dato.usuario = req.body.usuario;
            io.sockets.emit("mensajeServidor",dato);
        });
    });

}
