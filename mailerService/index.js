const {sendMail} = require('./sendgridAdapter');

class MailerInterface {
    static notifyIssue({from = 'v1tail no-reply@test.com', to, subject, html}) {
        return sendMail({from, to, subject, html})
    }
}


module.exports = {MailerInterface};
