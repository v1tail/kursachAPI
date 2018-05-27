const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    login :{
        type : String,
        required: true
    },
    lastLoggedIn : {
        type : Date,
    },
    repositories : {
        type : Array
    }
}, {
    versionKey: false,
    collection: 'githubUsers'
});

module.exports = schema;
