const app = module.exports = require('express')();
const Prediction = require('../../database/Prediction');
const MongClientWrapper = require('../../service/MongoClientWrapper');
const mongoClient = new MongClientWrapper();
const Collections = require('../../database/Collections');

app.post('/addOrUpdatePrediction', async (req, res) => {
    console.log("Entering /addOrUpdatePrediction");
    const searchObject = {
        username: req.body["username"],
        gameId: req.body["gameId"]
    };
    const predictionToAdd = new Prediction(req.body["username"], 
        req.body["gameId"], req.body["winningTeam"]);

    try {
        await mongoClient.runUpdate(Collections.PREDICTIONS, searchObject, predictionToAdd, true);
        res.status(200).json("Prediction added/updated")
    } catch (exception) {
        console.log("Problem adding or updating prediction: " + exception);
        res.status(500).json("Problem adding/updating a prediction");
    }
    console.log("Exiting /addOrUpdatePrediction")
});

app.get('/upcomingPredictions/:username', async (req, res) => {
    console.log("Entering /upcomingPredictions/" + req.body["username"]);

    try {
        const searchObject = {
            username: req.body["username"]
        }

        const predictionSearchResults = await mongoClient.runQuery(Collections.PREDICTIONS, searchObject);
        const predictionsOnTodayOrLater = [];
        for (result of predictionSearchResults) {
            let gameSearchObject = {
                gameId: result["gameId"],
                gameDate: { $gte : new Date()}
            };
            const game = await mongoClient.runQuery(Collections.GAMES, gameSearchObject);

            if (game !== null && game !== undefined) {
                predictionsOnTodayOrLater.push(result);
            }            
        }

        res.status(200).json(predictionsOnTodayOrLater);

    } catch (error) {
        console.error("Error retrieving upcoming predictions: " + error);
        res.status(500).json("Error retrieving upcoming predictions");
    }

    console.log("Exiting /upcomingPredictions/" + req.body["username"]);
});

app.get('/previousPredictions/:username', async (req, res) => {
    console.log("Entering /previousPredictions/" + req.params["username"]);

    try {
        const searchObject = {
            username: req.params["username"]
        }

        const predictionSearchResults = await mongoClient.runQuery(Collections.PREDICTIONS, searchObject);
        const predictionsOnTodayOrBefore = [];
        for (result of predictionSearchResults) {
            const gameSearchObject = {
                gameId: result["gameId"],
                gameDate: { $lte: new Date()}
            };
            const game = await mongoClient.runQuery(Collections.GAMES, gameSearchObject);
            if (game !== null && game !== undefined) {
                predictionsOnTodayOrBefore.push(result);
            }
        }

        res.status(200).json(predictionsOnTodayOrBefore);

    } catch (error) {
        console.error("Error retrieving previous predictions: " + error);
        res.status(500).json("Error retrieving previous predictions");
    }

    console.log("Exiting /previousPredictions/" + req.params["username"]);});