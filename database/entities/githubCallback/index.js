const ObjectId = require('bson-objectid');
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = require('./mongoose.schema');

const Model = mongoose.model('githubCallback', Schema);

class githubCallbackInterface {
    static get Model(){
        return Model
    }
}

module.exports = {githubCallbackInterface};
