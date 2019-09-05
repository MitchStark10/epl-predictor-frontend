const app = module.exports = require('express')();
const MongoClientWrapper = require('../../service/MongoClientWrapper');
const Game = require('../../database/Game');

app.post('/addNewGame', async (req, res) => {
    const gameToInsert = new Game(req.body['homeTeamName'], 
        req.body['awayTeamName'], 
        null,
        null,
        req.body['gameDate'] + " 04:00:00", 
        req.body['competition']);

    try {
        const mongoClient = new MongoClientWrapper();
        //TODO: Create collections constants
        //TODO: Potentially need to create a sync version of this client
        const response = await mongoClient.runInsert("games", gameToInsert);
        res.status(200).json(response);
    } catch (error) {
        console.error("Problem inserting new game: " + error);
        res.status(500).json("Problem inserting new game");
    }
});