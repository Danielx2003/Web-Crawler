const jsdom = require("jsdom");
const { Squad } = require('./Squad.js');
const { JSDOM } = jsdom;

class Collection {
    constructor(html) {
        this.squads = [];
        this.html = html;
        this.baseURL = 'https://transfermarkt.co.uk';
    }

    async getSquads() {
        if (this.squads.length == 0) {
            const squadURLs = this.getSquadURLs();
            await this.setSquads(squadURLs);
        }
        return this.squads;
    }

    async setSquads(squadURLs) {
        const promises = [];
        squadURLs.forEach((url) => {
            const squad = new Squad(url);
            const promise = squad.setHTMLBody().then(() => this.squads.push(squad));
            promises.push(promise);
        })
        await Promise.all(promises);
    }

    getSquadURLs() {
        const dom = new JSDOM(this.html);
        let urls = dom.window.document.getElementsByClassName('hauptlink no-border-links');
        let fullSquadUrls = Array.from(urls).map(url => ({
            team: url.querySelector('a').title,
            link: this.baseURL + url.querySelector('a').href
        }));
        return this.removeDuplicateTeams(fullSquadUrls);
    }

    removeDuplicateTeams(obj) {
        let mappedURLs = [];
        let uniqueTeams = new Set();
        obj.forEach(({team, link}) => {
            if (!uniqueTeams.has(team)) {
                uniqueTeams.add(team);
                mappedURLs.push(link);
            }
        })
        return mappedURLs;
    }
}

module.exports = {
    Collection
}