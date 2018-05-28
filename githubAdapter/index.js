const fetch = require('node-fetch');
const qs = require('qs');

class GitHubAdapter {
    static getBasicAuthHeader({credentials}) {
        const {
            email,
            password
        } = credentials;
        const buffer = new Buffer(`${email}:${password}`);
        const encodedAuthCredentials = buffer.toString('base64');
        return `Basic ${encodedAuthCredentials}`
    }

    static async getFromGitHub({url, options, credentials}) {
        const headers = {'Content-Type': 'application/json'};
        if (credentials) {
            headers.Authorization = this.getBasicAuthHeader({credentials});
        }
        const finalUrl = options ? url + qs.stringify(options) : url;
        return fetch(finalUrl, {
            method: 'GET',
            headers,
        }).then(res => res.json())
    }

    static async postForGitHub({url, options, credentials}) {
        const headers = {'Content-Type': 'application/json'};
        if (credentials) {
            headers.Authorization = this.getBasicAuthHeader({credentials});
        }
        return fetch(url, {
            method: 'POST',
            body : JSON.stringify(options),
            headers,
        }).then(res => res.json())
    }

    static async putGitHubApi(url, options, credentials) {
        // TODO
    }

    static async handleRequest({url, method, options, credentials}) {
        switch (method) {
            case ('GET') :
                return this.getFromGitHub({url, options, credentials});
            case ('POST') :
                return this.postForGitHub({url, options, credentials});
            case ('PUT') :
                return this.putGitHubApi({url, options, credentials});
            default:
                return this.getFromGitHub({url, options, credentials});
        }
    }
}

module.exports = {GitHubAdapter};
