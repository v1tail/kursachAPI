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
                    login: userLogin,
                    avatar_url
                }
            } = repository;
            const {
                html_url: issueURL
            } = issue;
            const {email: to} = await UserInterface.findUser({userLogin});
            await MailerInterface.notifyIssue({
                to,
                subject : `issue ${action}!`,
                html : `<div style="text-align:center; background-image:url(https://cs.pikabu.ru/post_img/big/2013/11/18/8/1384775795_1026843613.jpg); left: 0; right : 0; color : black; "><h3>Dear ${userLogin},</h3><img style="width: 90px;height:90px;" src=${avatar_url}><h4>You receive this email due to the subscribing for issues in <a href=${repositoryURL}>${repositoryName}</a> repository</h4><h4>We\`re glad to notify you, that issue was ${action} in <a href=${repositoryURL}>${repositoryName}</a> repository</h4><br><h4>click <a href=${issueURL}> here</a> to fast access</h4></div>`
            });
        }
        res.send(req.body)
    } catch (err) {
        logger.error(err);
        res.send(err)
    }
};
