'use strict'

var jwt = require ('jwt-simple');
var moment = require('moment');
var secret = 'esternocleidomastoideo';

exports.ensureAuth = function(req,res,next){  
    // aca compruebo q exista la autorizcion
   if(!req.headers.authorization){
        return res.status(403).send({message:'la peticion no tiene la cabecera de autorizacion'});
    }
    
    var token = req.headers.authorization.replace(/['"\ ]+/g,'');  //con .replace(/['"\ ]+/g,'') elimino las comillas y demas del token
    // aca decodifico e token

    try{
        var payload = jwt.decode(token,secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:'token expirado'});
        }
    }catch(ex){
       // console.log(ex);
        return res.status(404).send({message:'token invalido'});
    }
    // este es un objeto tipo usuario q viene con los datos q hala el token
    req.user = payload;

    //para salir del moddeware
    next();
};