const util = require('util');
const winston = require('winston');

winston.cli();

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            prettyPrint: true,
            silent: false,
            timestamp: false,
            colorize: true,
            json: false,
            handleExceptions: false,
            humanReadableUnhandledException: true,
        }),
    ],
});

logger.inspect = (...args) => {
    const inspected = util.inspect(args, { showHidden: false, depth: null });

    console.log(inspected);
};

module.exports = { logger };
