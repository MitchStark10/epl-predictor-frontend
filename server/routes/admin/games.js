const app = module.exports = require('express')();
const MongoClientWrapper = require('../../service/MongoClientWrapper');
const Game = require('../../database/Game');
const Collections = require('../../database/Collections');

app.post('/addNewGame', async (req, res) => {
    const gameToInsert = new Game(req.body['homeTeamName'], 
        req.body['awayTeamName'], 
        null,
        null,
        new Date(req.body['gameDate']), 
        req.body['competition']);

    try {
        const mongoClient = new MongoClientWrapper();
        const response = await mongoClient.runInsert(Collections.GAMES, gameToInsert);
        res.status(200).json(response["ops"]);
    } catch (error) {
        console.error("Problem inserting new game: " + error);
        res.status(500).json("Problem inserting new game");
    }
});