'use strict'

var express = require('express');
var AnimeController= require('../controllers/Controller-anime');

var api = express.Router();
var md_auth = require('../middelwares/authenticated');

var multipart = require('connect-multiparty'); 
var md_upload = multipart({uploadDir:'./uploads/anime'});

api.post('/anime',md_auth.ensureAuth,AnimeController.saveAnime);
api.post('/update-image-anime/:id',[md_auth.ensureAuth,md_upload],AnimeController.uploadImage);
api.get('/get-image-anime/:imageFile',AnimeController.getImageFile);
api.put('/anime/:id', md_auth.ensureAuth, AnimeController.updateAnime);
api.get('/ListAnimes/:page?',md_auth.ensureAuth,AnimeController.getAnimes);
api.get('/anime/:id',md_auth.ensureAuth, AnimeController.getAnime);
api.delete('/anime/:id', md_auth.ensureAuth, AnimeController.deleteAnime);


module.exports = api;
