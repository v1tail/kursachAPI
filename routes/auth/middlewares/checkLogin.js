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
        const {repos_url, login, message} = response;
        if (login) {
            const ifUserExist = await UserInterface.findUser({userEmail: email});
            if (ifUserExist) {
                const lastLoggedIn = new Date();
                await UserInterface.updateUser({userEmail: email, options: {lastLoggedIn}});
                return res.send(response)
            } else {
                const reposInfo = await GitHubAdapter.handleRequest({
                    url: repos_url,
                    method: 'GET',
                });
                const repositories = reposInfo.map((repos) => {
                    return {
                        githubId: repos.id,
                        name: repos.name,
                        fullName: repos['full_name']
                    }
                });
                const user = await UserInterface.createUser({userEmail: email, userLogin: login, repositories});
                const newHookConfig = {
                    "name" : "web",
                    "config" : {
                        "url" : process.env.callbackURL,
                        "content_type" : "json"
                    },
                    "events": [
                        "issues"
                    ]
                };
                const result = await Promise.all(reposInfo.map(async (repos) => {
                    const url = `https://api.github.com/repos/${login}/${repos.name}/hooks`;
                    return GitHubAdapter.handleRequest({
                        url,
                        method: 'POST',
                        options: newHookConfig,
                        credentials: {email, password}
                    });
                }));
                return res.send({user, result})
            }
        }
        return res.status(401).send({message})

    } catch (err) {
        return res.send(err)
    }
};
