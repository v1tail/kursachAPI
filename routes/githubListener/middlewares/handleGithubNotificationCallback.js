const {githubCallbackInterface} = require('../../../database/entities/githubCallback');
const {logger} = require('../../../utils/index');
const {MailerInterface} = require('../../../mailerService');
const {UserInterface}= require('../../../database/entities/user');
module.exports = async (req, res, next) => {
    try {
        const {
            action,
            issue,
            repository,
            sender
        } = req.body;
        logger.info(req.body);
        await githubCallbackInterface.Model.create({action, issue, repository, sender});
        if(issue) {
            const {
                name: repositoryName,
                html_url: repositoryURL,
                owner: {
                    login: userLogin
                }
            } = repository;
            const {
                html_url: issueURL
            } = issue;
            const {email: to} = await UserInterface.findUser({userLogin});
            await MailerInterface.notifyIssue({
                to,
                subject : `issue ${action}!`,
                html : `<p>Hi, ${userLogin}, issue was ${action} in <a href=${repositoryURL}>${repositoryName}</a> repo, click <a href=${issueURL}> here</a> to fast access</p>`
            });
        }
        res.send(req.body)
    } catch (err) {
        logger.error(err);
        res.send(err)
    }
};
