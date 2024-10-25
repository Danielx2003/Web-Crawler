const jsdom = require("jsdom");
const { MongoClient } = require('mongodb');
const { Collection } = require('./Collection.js');
require('dotenv').config();
const { JSDOM } = jsdom;

const client = new MongoClient(process.env.URI);

async function crawlPage(currentURL) {
    console.log(`crawling ${currentURL}`);

    try {
        client.connect().then(() => {
            console.log('Connected to the client.')
        })
        const db = client.db('test');
        const dbCollection = db.collection('players');
        dbCollection.drop();

        const resp = await fetch(currentURL);
        const htmlBody = (await resp.text());

        let collection = new Collection(htmlBody);
        const squads = await collection.getSquads();
        
        const promises = [];
        for (const squad of squads) {
            const players = await squad.getPlayers();
            for (const player of players) {
                let obj = player.getStats()
                if (!obj) {
                    continue;
                }
                const promise = dbCollection.insertOne(obj);
                promises.push(promise);
            }
        }
        await Promise.all(promises);
        console.log('Finished.');
        await client.close();
    } catch(e) {
        console.log(e)
        await client.close();
    }
}

module.exports = {
    crawlPage,
}