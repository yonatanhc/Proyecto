const express = require("express");
const path = require("path");
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

app.get("/carrito",(req,res)=>{
    if (req.session.usuario !== undefined) {
        req.session.carrito.push({
            modelo:req.query.modelo,
            precio:req.query.precio
        });
        res.render('perfil',{
            usuario : req.session.usuario,
            carrito: req.session.carrito
        });
    } else {
        res.sendFile(path.join(__dirname,'public/html/login.html')); 
    }
});

app.get("/iniciarSesion",(req,res)=>{
    if (req.session.usuario !== undefined) {
        res.render('perfil',{
            usuario : req.session.usuario,
            carrito: req.session.carrito
        });
    } else {
        res.sendFile(path.join(__dirname,'public/html/login.html')); 
    }
});

app.get("/homeTelefono",(req,res)=>{
    MongoClient.connect(dbURL, dbConfig, (err, client) => {
        if (!err) {
            const archivo = client.db(dbName);
            const colTelefonos = archivo.collection("telefonos");
            colTelefonos.find({modelo: req.query.modelo}).toArray((err, Untelefono) => {
                client.close();
                if (!err) {
                    res.render('homeTelefono',{
                        telefono:Untelefono
                    });
                }
                else{
                    console.log("error al abrir la colleccion");
                }
            });
        }
        else{
            console.log("error al abrir el archivo");
        }
    });
    
});

app.get("/salir",(req,res)=>{
    req.session.destroy();
    res.render('home');
});

app.get("/registrarse",(req,res)=>{
    res.sendFile(path.join(__dirname,'public/html/crearCuenta.html'));
});


app.post('/login',(req,res)=>{
    if(req.body.user && req.body.password){
        validarUser(req.body.user,req.body.password,resultado =>{
            if(resultado){
                req.session.usuario = resultado;
                req.session.carrito = [];
                res.render('perfil',{
                    usuario : req.session.usuario,
                    carrito: req.session.carrito
                })
            }
            else{
                req.session.destroy();
                res.sendFile(path.join(__dirname,'public/html/login.html'));
            }
        });
    }
    else{
        res.sendFile(path.join(__dirname,'public/html/login.html'));
    }
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

function validarUser(usr, pwd, callback) {
    MongoClient.connect(dbURL, dbConfig, (err, client) => {
        if(!err) {
            const colUsuarios = client.db(dbName).collection("usuarios");
            colUsuarios.findOne({ usuario: usr, contraseña: pwd }, (err, resConsulta) => {
                client.close();
                if (!err) {
                    callback(resConsulta);
                }
            });
        }
    });
  
}