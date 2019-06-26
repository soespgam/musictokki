'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist:{type: Schema.ObjectId, ref:'artist'},
    anime:{type: Schema.ObjectId, ref:'anime'} 
});

module.exports = mongoose.model("album",AlbumSchema);