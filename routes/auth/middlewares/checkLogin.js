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
        const {repos_url, login,message} = response;
        if (login) {
            const ifUserExist = await UserInterface.findUser({userEmail : email});
            if (ifUserExist) {
                const lastLoggedIn = new Date();
                await UserInterface.updateUser({userEmail: email, options: {lastLoggedIn}})
            } else {
                const reposInfo = await GitHubAdapter.handleRequest({
                    url: repos_url,
                    method: 'GET',
                });
                const repositories = reposInfo.map((repos)=>{
                    return {
                        githubId : repos.id,
                        name : repos.name,
                        fullName : repos['full_name'],
                        watched : false
                    }
                });
                const user = await UserInterface.createUser({userEmail: email, userLogin: login,repositories})
                return res.send(user)
            }
        }
        res.status(401).send({message})

    } catch (err) {
        return res.send(err)
    }
};
