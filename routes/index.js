const express = require('express');
const authRouter = require('./auth/router');
const githubCallbackRouter = require('./githubListener/router');

const apiRouter = express.Router();

module.exports = (app) => {
    app.use('/api', apiRouter);
    apiRouter.use('/', authRouter);
    apiRouter.use('/callback', githubCallbackRouter);
};
