const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');
const {connectToTheDataBase} = require('./database');
const {
    logger
} = require('./utils');

let app;

process.on('unhandledRejection', (reason) => {
    logger.error(reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    logger.error(error);
    process.exit(1);
});

(async()=>{
  await connectToTheDataBase();
    app = express();
    app.use(morgan('dev'));
    app.use(bodyParser.json({
        strict: false,
        limit: '10mb',
    }));
    app.use(bodyParser.urlencoded({
        extended: false,
    }));
    app.use(cookieParser());

    require('./routes')(app);
    app.use((err, req, res, next) => {
        const {
            status = 500,
            message = 'Internal server Error',
        } = err;
        res.status(status).send({ error: { message } });
    });

    const httpServer = http.createServer(app);

    httpServer.listen(process.env.PORT || 5000, () => {
        logger.info(' --------------------------------------------------------------------');
        logger.info(`  Server started at port ${httpServer.address().port}`);
        logger.info(' --------------------------------------------------------------------');
    });

})();
