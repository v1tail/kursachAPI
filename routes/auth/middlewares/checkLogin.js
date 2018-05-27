const {GitHubAdapter} = require('../../../githubAdapter');
const {UserInterface} = require('../../../database/entities/user');
module.exports = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const response = await GitHubAdapter.handleRequest({
            url: 'https://api.github.com/user',
            method: 'GET',
            credentials: {email, password}
        });
        const {repos_url, login} = response;
        if (login) {
            const ifUserExist = await UserInterface.findUser({userEmail : email});
            if (ifUserExist) {
                const lastLoggedIn = new Date();
                await UserInterface.updateUser({userEmail: email, options: {lastLoggedIn}})
            } else {
                await UserInterface.createUser({userEmail: email, userLogin: login})
            }
            const reposInfo = await GitHubAdapter.handleRequest({
                url: repos_url,
                method: 'GET',
            });
            return res.send(reposInfo)

        }
        return res.send(response)
    } catch (err) {
        return res.send(err)
    }
};
