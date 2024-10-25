const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const { Player } = require('./Player.js');

class Squad {
    constructor(url) {
        this.players = [];
        this.html = null;
        this.url = url;
        this.baseURL = 'https://transfermarkt.co.uk';
    }

    async setHTMLBody() {
        const resp = await fetch(this.url);
        this.html = await resp.text();
    }

    async getHTMLBody() {
        while (this.html == null) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        return this.html
    }

    async getPlayers() {
        if (this.players.length == 0) {
            const playerURLs = this.getPlayerURLs();
            await this.setPlayers(playerURLs);
        }
        return this.players;
    }

    async setPlayers(playerURLs) {
        const promises = [];
        playerURLs.forEach((url) => {
            const player = new Player(url);
            const promise = player.setHTMLBody().then(() => this.players.push(player));
            promises.push(promise)
        })
        await Promise.all(promises);
    }
    
    getPlayerURLs() {
        const dom = new JSDOM(this.html);
        let table = dom.window.document.querySelectorAll('table.inline-table tbody tr td.hauptlink a');
        let playerURLs = [];

        if (table.length > 0) {
            table.forEach(player => {
                playerURLs.push(`${this.baseURL}${player.href}`);
            })
        }
        return playerURLs;
    }
}

module.exports = {
    Squad
}
