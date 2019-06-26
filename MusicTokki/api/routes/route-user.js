'use strict'

var express = require('express');
var UserController = require('../controllers/Controller-user');

var api = express.Router(); // aca cargo el express 
var md_auth = require('../middelwares/authenticated');  //aca cargo el midelware

var multipart = require('connect-multiparty'); // modulo para subir ficheros con protocolo http
var md_upload = multipart({uploadDir:'./uploads/users'}); // aca subo los ficheros

api.get('/probando-controlador',md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.SaveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);
api.post('/update-image/:id',[md_auth.ensureAuth,md_upload],UserController.UploadImage);
api.get('/get-image/:imageFile',UserController.getImageFile);


module.exports = api;