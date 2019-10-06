const express = require("express");
const path = require("path");
const fs = require('fs');
const exphbs = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dbURL = "mongodb://localhost:27017";
const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true};
const dbName = "archivos";

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

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
    if (req.session.usuario !== undefined) {
        res.render('perfil',{
            datosUsuario : req.session.usuario, 
        });
    } else {
        res.sendFile(path.join(__dirname,'public/html/login.html')); 
    }
});

app.get("/homeTelefono",(req,res)=>{
    console.log(req.query.idTelefono);
    MongoClient.connect(dbURL, dbConfig, (err, client) => {
        if (!err) {
            const archivo = client.db(dbName);
            const colTelefonos = archivo.collection("telefonos");
            colTelefonos.find({_id: req.query.idTelefono}).toArray((err, telefono) => {
                client.close();
                if (!err) {
                    console.log(telefono);
                }
            });
        }
    });
    res.render('homeTelefono');
});

app.get("/salir",(req,res)=>{
    console.log("salir");
    req.session.destroy();
    res.render('home');
});

app.get("/registrarse",(req,res)=>{
    res.sendFile(path.join(__dirname,'public/html/crearCuenta.html'));
});


app.post('/sesion',(req,res)=>{
    MongoClient.connect(dbURL, dbConfig, (err, client) => {
        if (!err) {
            const archivo = client.db(dbName);
            const colUsuarios = archivo.collection("usuarios");
            colUsuarios.find({}).toArray((err, usuarios) => {
                client.close();
                if (!err) {
                    usuarios.forEach(usuario=>{
                        if(usuario.usuario == req.body.usuario && usuario.contraseña == req.body.contraseña){
                            req.session.usuario = usuario;
                            res.render('perfil',{
                                datosUsuario : req.session.usuario, 
                            });
                        }
                    });
                }
            });
        }
    });
});


app.get("/buscar",(req,res)=>{
    
    MongoClient.connect(dbURL, dbConfig, (err, client) => {
    if (!err) {

        const archivo = client.db(dbName);

        const colTelefonos = archivo.collection("telefonos");
        
        colTelefonos.find({ marca: req.query.buscar }).toArray((err, telefonos) => {
            client.close();
            if (!err) {
                res.render('telefono', {
                    listaTelefonos: telefonos
                });
            } else {
                console.log("No se pudo consultar la colección de telefonos: " + err);
            }
        });

    } else {
        console.log("ERROR AL CONECTAR: " + err);
    }
    });
});

const server = app.listen(3000,()=>{
    console.log("corriendo en el puerto 3000...");
});

/*
function ingresarPerfil(data,res){
    res.render('perfil',{
        datosUsuario:data});

    const io = socketio(server);

    io.on('connection',(socket)=>{
        console.log("conectado");
        socket.on("miMensaje",(dato)=>{
            dato.usuario = data.usuario;
            io.sockets.emit("mensajeServidor",dato);
        });
    });

}
*/

