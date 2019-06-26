'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
//var Anime = require('../models/anime');
var config = require('../config/config');


//crear artista
function saveArtist(req, res) {
    var artist = new Artist();
    var params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
             res.status(500).send({  message: config.message.ERROR_GUARDAR +'El artista' });
        }else{
            if (!artistStored) {
                res.status(404).send({  message: config.message.AD_NO_GUARDO +'El artista' });
            }else{
                res.status(200).send({ artist: artistStored });
            }
        }
    });
}

// actualizar un artista 

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update , (err , artistUpdate)=>{
        if (err){
           res.status(500).send({ message: config.message.ERROR_ACTUALIZACION+'El artista'});
        }else{
            if (!artistUpdate){
                  res.status(404).send({message: config.message.AD_NO_ACTUALIZADO +'El artista'});
            }else{
                 res.status(200).send({artist:artistUpdate});
            }
        }
    });
}

// conseguir un artista
function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({ message:config.message.ERROR_PETICION });
        }else{
            if (!artist) {
                 res.status(404).send({ message:config.message.ERROR_NO_EXISTE +'El artista'});
            }else{
                res.status(200).send({ artist });
            }
        }
    });
}

// la lista de los artitas
function getArtists(req, res) {

    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }

    var page = req.params.page;
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function (err, artists, total) {
        if (err) {
            res.status(500).send({ message:config.message.ERROR_PETICION });
        }else{
            if (!artists) {
                res.status(404).send({ message:config.message.ERROR_NO_EXISTE + 'El artista' });
            }else{
                res.status(200).send({
                totalItems: total,
                artists: artists
                });
            }
        }
    });
}

// eliminar un artista 

function deleteArtist(req, res){
    var artistId = req.params.id;
   Artist.findByIdAndRemove(artistId, (err,artistRemoved) =>{
       if(err){
            res.status(500).send({message:config.message.ERROR_ELIMINAR +'El artista'});
       }else{
            if(!artistRemoved){
                 res.status(404).send({ message:config.message.AD_NO_ELIMINADO + 'El artista'});
            }else{
                // elimino todos los albumnes relacionados con este artista
                Album.find({artist: artistRemoved._id}).remove((err,albumRemoved)=>{
                    if(err){
                        res.status(500).send({message: config.message.ERROR_ELIMINAR + 'El album'});
                    }else{
                        if(!albumRemoved){
                             res.status(404).send({ message: config.message.AD_NO_ELIMINADO +' El album'});
                        }else{
                            // elimino todos las canciones relacionados con este artista
                            Song.find({Album:albumRemoved._id}).remove((err,songRemoved)=>{
                                if(err){
                                    res.status(500).send({message:config.message.ERROR_ELIMINAR + 'la canciòn'});
                                }else{
                                    if(!songRemoved){
                                         res.status(404).send({ message: config.message.AD_NO_ELIMINADO +'la canciòn'});
                                    }else{
                                        res.status(200).send({artist:artistRemoved});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
   });
}

// cargo la imagen del artista
function uploadImage(req,res){
    var artistId = req.params.id;
    var file_name = 'imagen';

    if (req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\'); 
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        console.log(ext_split);

        if(file_ext == 'png'||file_ext == 'jpg'||file_ext == 'gif'){
            
            Artist.findByIdAndUpdate(artistId,{image:file_name},(err,artistUpdated)=>{
                if(!artistUpdated){
                    res.status(404).send({message:config.message.AD_NO_ACTUALIZADO + 'El artista'});
                }else{
                    res.status(200).send({artist:artistUpdated});
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
    var path_file = './uploads/artist/'+ imageFile;
    
    fs.exists(path_file, function(exists){
        if(exists){
          res.sendFile(path.resolve(path_file)); 
        }else{
          res.status(200).send({message:config.message.ERROR_IMAGEN});
        }
    });
}


module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist, 
    deleteArtist,
    uploadImage,
    getImageFile
};