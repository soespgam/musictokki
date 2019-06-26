'use strict'

var express = require ('express');
var bodyParser = require('body-parser');

var app= express();

// cargar rutas

var user_routes = require('./routes/route-user');
var artist_routes = require('./routes/route-artist');
var anime_routes = require('./routes/route-anime');
var album_routes = require('./routes/route-album');

//(aca se convierte los datos q ingresan en objetos json)
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//aca cofiguro cabeceras htt

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY ,Origin , X-Requested-With, Content-Type,Accept,Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
    res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');

    next();
});

// aca van las rutas base

app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', anime_routes);
app.use('/api', album_routes);

// importo el modulo
module.exports = app;