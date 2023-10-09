const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://danielspicer:Scrappy2003@cluster0.qs66vcb.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri);

async function getPlayers() {
    try {
        console.log("trying")
        await client.connect();
        console.log("connected")
        const db = client.db('footle');
        const collection = db.collection('players');
        console.log("connected")
    } catch (err) {
        console.log(err)
    } finally {
        // Close the database connection when finished or an error occurs
        await client.close();
    }
}

getPlayers()
