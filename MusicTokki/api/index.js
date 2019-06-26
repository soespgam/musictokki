'use strict' //sirve para meter instrucciones de los nuevos estandares de javascript


var mongoose = require ('mongoose');   // aca cargo un modulo o fichero
var app = require('./app');
var port = process.env.port ||3977; // este es el puerto de defecto de nuestro servidor back de nodejs



// se conecta a la bd de mongo
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/bdtokki', (err,res)=> {   
    if (err){
        throw err;
    }else{
        console.log("conexion exitosa ");

        app.listen (port, function(){
            console.log("servidor web escuchando en http://localhost:"+ port);
        });
    }
});
