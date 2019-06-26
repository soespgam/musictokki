'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var Anime = require('../models/anime');
var config = require('../config/config');


//crear anime
function saveAnime(req, res) {
    var anime = new Anime();
    var params = req.body;

    var params = req.body;
    anime.name = params.name;
    anime.description = params.description;
    anime.image = 'null';

    anime.save((err, animeStored) => {
        if (err) {
             res.status(500).send({  message: config.message.ERROR_GUARDAR +'El anime' });
        } else{
            if (!animeStored) {
                res.status(404).send({  message: config.message.AD_NO_GUARDO +'El anime' });
            }else{ 
                res.status(200).send({ anime: animeStored });
            }
        }
    });
}

// cargo la imagen del anime
function uploadImage(req,res){
    var animeId = req.params.id;
    var file_name = 'imagen no existe';

    if (req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\'); 
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        console.log(ext_split);

        if(file_ext == 'png'||file_ext == 'jpg'||file_ext == 'gif'){
            //con esto actualizo la imagen o documento del usuario
            Anime.findByIdAndUpdate(animeId,{image:file_name},(err,animeUpdated)=>{
                if(!animeUpdated){
                   res.status(404).send({message:config.message.ERROR_ACTUALIZACION +'El usuario'});
                }else{
                    return res.status(200).send({anime:animeUpdated});
                }
            });
        }else{
         res.status(200).send({message:config.message.ERROR_EXTENSION_FILE});
        }
    }else{
        res.status(200).send({message:config.message.ERROR_IMAGEN});
    }
        };

function getImageFile(req,res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/anime/'+ imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
           res.sendFile(path.resolve(path_file)); 
        }else{
            res.status(200).send({message:config.message.ERROR_IMAGEN});
        }
    });
}


// actualizar un anime 

function updateAnime(req, res) {
    var animeId = req.params.id;
    var update = req.body;

    Anime.findByIdAndUpdate(animeId, update , (err , animeUpdate)=>{
        if (err){
            res.status(500).send({ message: config.message.ERROR_ACTUALIZACION+'El anime'}); 
        }else{
            if (!animeUpdate){
                res.status(404).send({message: config.message.AD_NO_ACTUALIZADO +'El anime'});
            }else{
                res.status(200).send({anime:animeUpdate});
            }
        }
    });
}

// la lista de los animes
function getAnimes (req, res) {

    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }

    var page = req.params.page;
    var itemsPerPage = 3;

    Anime.find().sort('name').paginate(page, itemsPerPage, function (err, animes, total) {
        if (err) {
            res.status(500).send({ message:config.message.ERROR_PETICION });
        }else{
            if (!animes) {
                res.status(404).send({ message:config.message.ERROR_NO_EXISTE + 'El artista' });
            }else{
                res.status(200).send({
                totalItems: total,
                animes: animes
                });
            }
        }
    });
}

// Busco un anime
function getAnime (req, res) {
    var animeId = req.params.id;

    Anime.findById(animeId, (err, anime) => {
        if (err) {
            res.status(500).send({ message:config.message.ERROR_PETICION });
        } else{
            if (!anime) {
                res.status(404).send({ message:config.message.ERROR_NO_EXISTE +'El anime'});
            }else{
                res.status(200).send({ anime });
            }
        }
    });
}


// eliminar un anime 
function deleteAnime(req, res){
    var animeId = req.params.id;

   Anime.findByIdAndRemove(animeId,(err,animeRemoved) =>{
       if(err){
        res.status(500).send({message:config.message.ERROR_ELIMINAR +'El anime'});
       }else{
            if(!animeRemoved){
                res.status(404).send({ message:config.message.AD_NO_ELIMINADO + 'El anime'});
            }else{
                Song.find({Album:albumRemoved._id}).remove((err,songRemoved)=>{
                    if(err){
                        res.status(500).send({message:config.message.ERROR_ELIMINAR + 'la canciòn'});
                    }else{
                        if(!songRemoved){
                            res.status(404).send({ message: config.message.AD_NO_ELIMINADO +'la canciòn'});
                       }else{
                           res.status(200).send({anime: animeRemoved});
                       }     
                    }
                });
            }
        }
    });
}


module.exports = {
    saveAnime,
    uploadImage,
    getImageFile,
    updateAnime,
    getAnimes,
    getAnime,
    deleteAnime
    
    
};

