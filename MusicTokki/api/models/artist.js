'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = Schema({
    name: String,
    description: String,
    anime:{type: Schema.ObjectId, ref:'Anime'},
    image: String,
});

module.exports = mongoose.model("artist",ArtistSchema);