const app = module.exports = require('express')();
const Collections = require('../../database/Collections');
const Game = require('../../database/Game');
const MongoClientWrapper = require('../../service/MongoClientWrapper');
const mongoClient = new MongoClientWrapper();

const SELECT_TEAM_NAMES = `
SELECT HomeTeamName, AwayTeamName
FROM GAME
WHERE GameId = ?
`;

const UPDATE_TEAM_NAMES_SQL = `
UPDATE PREDICTION
SET WinningTeam = ?
WHERE WinningTeam = ?
    AND GameId = ?
`;

const UPDATE_GAME_SQL = `
UPDATE GAME
SET HomeTeamName = ?, AwayTeamName = ?, HomeTeamScore = ?, AwayTeamScore = ?, GameDate = ?, Competition = ?
WHERE GameId = ?
`;

let determineScoreQueryParam = (scoreRequestParam) => {
    console.log("Score request param: '" + scoreRequestParam + "'");

    if (scoreRequestParam === "") {
        return null;
    }

    return scoreRequestParam;
}

let updatePredictionTeamNames = async (oldName, newName, gameId) => {
    const searchObject = {
        gameId: gameId,
        winningTeam: oldName
    };

    const updateObject = {
        winningTeam: newName
    };

    await mongoClient.runUpdate(Collections.PREDICTIONS, searchObject, updateObject, false);
}

let checkIfPredictionTeamNamesNeedToUpdate = async (req) => {
    let gameSearchObject = {
        gameId: gameId
    }

    let teamNameResponse = await mongoClient.runSingleObjectQuery(Collections.GAMES, gameSearchObject);
    let homeTeamName = teamNameResponse["homeTeamName"];
    let awayTeamName = teamNameResponse["awayTeamName"];

    if (req.body["homeTeamName"] !== homeTeamName) {
        console.log("Updating home team name predictions for game: " + req.params["gameId"]
            + " from " + homeTeamName + " to " + req.body["homeTeamName"]);
        
        updatePredictionTeamNames(homeTeamName, req.body["homeTeamName"], req.params["gameId"]);
    }

    if (req.body["awayTeamName"] !== awayTeamName) {
        console.log("Updating home team name predictions for game: " + req.params["gameId"]
            + " from " + awayTeamName + " to " + req.body["awayTeamName"]);

            updatePredictionTeamNames(awayTeamName, req.body["awayTeamName"], req.params["gameId"]);
    }
}

app.post('/updateGame/:gameId', async (req, res) => {
    try {
        await checkIfPredictionTeamNamesNeedToUpdate(req);
    } catch (error) {
        console.log("Issue occured updating team names for predictions: " + error);
        res.status(500).json("Error updating game");
        return 
    }

    let homeTeamScore = determineScoreQueryParam(req.body["homeTeamScore"]);
    let awayTeamScore = determineScoreQueryParam(req.body["awayTeamScore"]);

    let searchObject = {
        gameId: req.params.gameId  
    };

    let updateGameObject = new Game(req.body["homeTeamName"], req.body["awayTeamName"], 
        homeTeamScore, awayTeamScore, new Date(req.body["gameDate"]), req.body["competition"]);

    try {
        await mongoClient.runUpdate(Collections.GAMES, searchObject, updateGameObject, false);
        res.status(200).json("Successfully updated game: " + req.params.gameId)
    } catch (error) {
        console.error("Error updating game: " + req.params["gameId"] + ": " + error);
        res.status(500).json("Error updating game");
    }
});