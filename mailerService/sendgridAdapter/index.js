const nodeMailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = { auth: { api_key: process.env.MAILER_TOKEN} };
const mailer = nodeMailer.createTransport(sgTransport(options));

async function sendMail(email) {
    try {
        await mailer.sendMail(email);
    } catch (ex) {
        throw ex;
    }
}

module.exports = {
    sendMail
};
