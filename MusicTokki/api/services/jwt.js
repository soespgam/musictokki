'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'esternocleidomastoideo';

// creo metodo

exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),  // esta es la fecha de creacion del token
        exp: moment().add(30, 'days').unix() // esta es la fecha de expiracion
    };
    return jwt.encode(payload, secret); //retorno el token decodificado
};