'use strict'
//nota: req= recibe , res= responde

var fs = require('fs'); // este es el sistema de ficheros 
var path = require('path'); // para acceder a las rutas de as img
var bcrypt =require ('bcrypt-nodejs');
var User = require('../models/user'); // 1)importo modelo
var jwt = require('../services/jwt'); // importo el token  
var config = require('../config/config');

// 2) creo las funcionnes 

function pruebas (req,res){
    res.status(200).send({
        message:'probando el controlador de usuarios'
    });
}

//creo usuario
function SaveUser(req,res){
    var user = new User(); // nuevo objeto tipo usuario
    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE-USER';
    user.image = 'null'; 
    
    //aca encripto contraseña
    if (params.password){
        // para encriptar contraseña
        bcrypt.hash(params.password, null,null,function(err,hash){
            user.password = hash;

            if (user.name !=null && user.surname != null && user.email != null){
                //guardo el usuario
                user.save((err, userStored)=> {
                    if(err){
                      return  res.status(500).send({message:config.message.ERROR_GUARDAR +'El usuario'});  
                    } else {
                    if (!userStored){
                        return res.status(404).send({message:config.message.ERROR_REGISTRO});
                    }else{
                        return res.status(200).send({user: userStored});
                    }
                }     
                });
            }else{
             return res.status(200).send({message:config.message.ERROR_CAMPOS_INCOMPLETOS});
            } 
        }); 
    }else{
     return res.status(200).send({message:config.message.AD_FALTA_CONTRASEÑA});
    }
}


function loginUser(req,res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email:email.toLowerCase()},(err,user)=>{
        if (err){
            res.status(500).send({message:config.message.ERROR_PETICION});
        }else{
            if(!user){
                res.status(404).send({message:config.message.ERROR_NO_EXISTE+'El usuario'});
            }else{
                // compuebo contraseña
                bcrypt.compare(password,user.password, function(err,check){
                    console.log(check);
                    if(check==true){
                         //deuelvo los datos del usuario logueado
                         if (params.gethash){
                            // se devuelve un token de jwt
                             res.status(200).send({ token: jwt.createToken(user)});    
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message:config.message.ERROR_LOGUEO});
                    }
                });
            }
        }
    });
}    
 
function updateUser (req,res){
    var userId =req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId,update, (err, userUpdated) => {
        if(err){
            res.status(404).send({message:config.message.ERROR_ACTUALIZACION +'El usuario'});
        }else{
           if(!userUpdated){
                 res.status(404).send({message:config.message.ERROR_ACTUALIZACION +'El usuario'});
            }else{
             res.status(200).send({user:userUpdated});
            }
        }
    });
}

//funcion para cargar imagenes

function UploadImage(req,res){
    var userId = req.params.id;
    var file_name = 'imagen no existe';

    if (req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\'); //con esto corto el streem por la barras
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        console.log(ext_split);

        if(file_ext == 'png'||file_ext == 'jpg'||file_ext == 'gif'){
            //con esto actualizo la imagen o documento del usuario
            User.findByIdAndUpdate(userId,{image:file_name},(err,userUpdated)=>{
                if(!userUpdated){
                   res.status(404).send({message:config.message.ERROR_ACTUALIZACION +'El usuario'});
                }else{
                    return res.status(200).send({image:file_name, user:userUpdated});
                }
            });
        }else{
         res.status(200).send({message:config.message.ERROR_EXTENSION_FILE});
        }
    }else{
        res.status(200).send({message:config.message.ERROR_IMAGEN});
    }
};

// funcion para recuperar la imagen
function getImageFile(req,res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+ imageFile

    fs.exists(path_file, function(exists){
        if(exists){
           res.sendFile(path.resolve(path_file)); 
        }else{
           res.status(200).send({message:config.message.ERROR_IMAGEN});
        }
    });
}


//3) exporto en un modulo para que la funcion sea publica
module.exports = {
    pruebas,
    SaveUser,
    loginUser,
    updateUser,
    UploadImage,
    getImageFile

};
