const ObjectId = require('bson-objectid');
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = require('./mongoose.schema');

const Model = mongoose.model('githubUsers', Schema);

class UserInterface {
    static getUserModel() {
        return Model;
    }

    static async findUser({userEmail, userLogin, uId}) {
        const findObject = this.getFindObject({userEmail, userLogin, uId});
        return Model.findOne(findObject).catch((err)=>{
            throw  err
        });
    }

    static async createUser({userEmail, userLogin}) {
        const lastLoggedIn = new Date();
        const userObj = {
            login: userLogin,
            email: userEmail,
            lastLoggedIn
        };
        return Model.create(userObj);
    }

    static async updateUser({userEmail, options}) {
        return Model.updateOne({email: userEmail}, {$set: options})
    }

    static getFindObject({userEmail, userLogin, uId}) {
        const findObj = {};
        if (userEmail) {
            findObj.email = userEmail
        }
        if (userLogin) {
            findObj.login = userLogin
        }
        if (uId) {
            findObj._id = ObjectId(uId)
        }
        return findObj
    }
}

module.exports = {UserInterface};
