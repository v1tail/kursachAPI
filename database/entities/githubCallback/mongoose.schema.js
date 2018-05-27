const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema({
    action : {
        type : String,

    },
    issue :{
        type : Object,

    },
    repository : {
        type : Object,

    },
    sender : {
        type : Object,

    },
}, {
    versionKey: false,
    collection: 'githubCallback'
});

module.exports = schema;
