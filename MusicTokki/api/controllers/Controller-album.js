'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var Anime = require('../models/anime');
var config = require('../config/config');


//creo el Album
function saveAlbum(req,res){
    var album = new Album();
    
    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist= params.artist;
    album.anime= params.anime;

    album.save((err, albumStored) => {
        if (err) {
             res.status(500).send({  message: config.message.ERROR_GUARDAR +'El album' });
        }else{
            if (!albumStored) {
                res.status(404).send({  message: config.message.AD_NO_GUARDO +'El album' });
            }else{
                res.status(200).send({ album: albumStored });
            }
        }
    });
}



// conseguir un artista
function getAlbum(req, res) {
    var albumId = req.params.id;

    Album.findById(albumId).populate({path:'anime'}).populate({path:'artist'}).exec((err,album)=>{
        if (err) {
            res.status(500).send({ message:config.message.ERROR_PETICION });
        }else{
            if (!album) {
                 res.status(404).send({ message:config.message.ERROR_NO_EXISTE +'El album'});
            }else{
                res.status(200).send({ album });
            }
        }
    });
    
}
    

// mostrar lista de albumns

function getAlbums(req,res){
    var artistId = req.params.artist;
    var animeId = req.params.anime;

    if(!artistId && !animeId){
        // saco todos los albums de la  bd
        var find = Album.find({}).sort('title');
    }else{
        // saco todos los albums de un artista y de un anime de la bd
        var find = Album.find({artist:artistId}).sort('year');
        var find = Album.find({anime:animeId}).sort('year');
    }
    find.populate({path:'anime'}).populate({path:'artist'}).exec((err,albums)=>{
        if(err){
            res.status(500).send({ message:config.message.ERROR_PETICION });  
        }else{
            if(!albums){
                res.status(404).send({ message:config.message.ERROR_NO_EXISTE + 'El album'});
            }else{
                res.status(404).send({albums});  
            }
        }
    });
}

// actualizar el album
function updateAlbum(req,res){
    var albumId= req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId,update ,(err, albumUpdate)=>{
        if(err){
            res.status(500).send({ message:config.message.ERROR_SERVIDOR}); 
        }else{
            if(!albumUpdate){
                res.status(404).send({ message:config.message.AD_NO_ACTUALIZADO + 'El album' }); 
            }else{
                res.status(200).send({album:albumUpdate});
            }
        }
    });
}

//eliminar albumnes
 function deleteAlbum(req,res){
     var albumId = req.params.id;

     Album.findByIdAndRemove(albumId,(err,albumRemoved)=>{
        if(err){
            res.status(500).send({message: config.message.ERROR_ELIMINAR + 'El album'});
        }else{
            if(!albumRemoved){
                 res.status(404).send({ message: config.message.AD_NO_ELIMINADO +'El album'});
            }else{
                // elimino todos las canciones relacionados con este artista
                Song.find({Album:albumRemoved._id}).remove((err,songRemoved)=>{
                    if(err){
                        res.status(500).send({message:config.message.ERROR_ELIMINAR + 'la canciòn'});
                    }else{
                        if(!songRemoved){
                             res.status(404).send({ message: config.message.AD_NO_ELIMINADO +'la canciòn'});
                        }else{
                            res.status(200).send({album:albumRemoved});
                        }
                    }
                });
            }
        }
    });
}

// cargo la imagen del album
function uploadImage(req,res){
    var albumId = req.params.id;
    var file_name = 'imagen';

    if (req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\'); 
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        console.log(ext_split);

        if(file_ext == 'png'||file_ext == 'jpg'||file_ext == 'gif'){
            
            Album.findByIdAndUpdate(albumId,{image:file_name},(err,albumUpdated)=>{
                if (err){
                    res.status(404).send({message:'Eeerror album'});
                }else{
                    if(!albumUpdated){
                        res.status(404).send({message:config.message.AD_NO_ACTUALIZADO + 'El album'});
                    }else{
                        res.status(200).send({album:albumUpdated});
                    }
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
    var path_file = './uploads/album/'+ imageFile;
    
    fs.exists(path_file, function(exists){
        if(exists){
          res.sendFile(path.resolve(path_file)); 
        }else{
          res.status(200).send({message:config.message.ERROR_IMAGEN});
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};