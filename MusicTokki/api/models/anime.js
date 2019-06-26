
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnimeSchema = Schema({
    name: String,
    description: String,
    image: String,
    song:{type: Schema.ObjectId, ref:'Song'},
    artist:{type: Schema.ObjectId, ref:'Artist'}
});

module.exports = mongoose.model("anime",AnimeSchema);

 
