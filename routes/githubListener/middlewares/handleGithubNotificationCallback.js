const {githubCallbackInterface} = require('../../../database/entities/githubCallback');
const {logger} = require('../../../utils/index');
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
        res.send(req.body)
    }catch (err){
       logger.error(err);
       res.send(err)
    }
};
