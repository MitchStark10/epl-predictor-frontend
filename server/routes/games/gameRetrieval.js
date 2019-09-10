const app = module.exports = require('express')();
const Collections = require('../../database/Collections');
const MongoClientWrapper = require('../../service/MongoClientWrapper');
const mongoClient = new MongoClientWrapper();

app.get('/retrieveAllUpcomingGames', async (req, res) => {
    console.log("Entering /retrieveAllUpcomingGames");

    //TODO: Is this now?
    const today = new Date();
    //TODO: Correct syntax if needed
    const searchObj = {
        gameDate: { gt: today }
    };

    try {
        const previousGameResponse = await mongoClient.runQuery(Collections.GAMES, searchObj);
        res.status(200).json(previousGameResponse);
    } catch (exception) {
        console.error("Caught exception trying to retrieve all upcoming games: " + exception);
        res.status(500).json("Exception caught while retrieving all upcoming games: " + exception);
    }

    console.log("Exiting /retrieveAllUpcomingGames");
});

app.get('/retrieveAllPastGames', async (req, res) => {
    console.log("Entering /previousGames");

    //TODO: Is this now?
    const today = new Date();
    //TODO: Correct syntax if needed
    const searchObj = {
    gameDate: { $lt: new Date() }
    };

    try {
        const previousGameResponse = await mongoClient.runQuery(Collections.GAMES, searchObj);
        res.status(200).json(previousGameResponse);
    } catch (exception) {
        console.error("Caught exception trying to retrieve all previous games: " + exception);
        res.status(500).json("Exception caught while retrieving all previous games: " + exception);
    }

    console.log("Exiting /previousGames");
});

app.get('/retrieveAllGames', async (req, res) => {
    console.log("Entering /retrieveAllGames");

    try {
        const allGameResponse = await mongoClient.runQuery(Collections.GAMES, null);
        res.status(200).json(allGameResponse);
    } catch (exception) {
        console.error("Caught exception trying to retrieve all games: " + exception);
        res.status(500).json("Exception caught while retrieving all games: " + exception);
    }

    console.log("Exiting /retrieveAllGames");
});

