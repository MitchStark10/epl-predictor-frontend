const app = module.exports = require('express')();
const QueryRunner = require('../../service/QueryRunner').buildQueryRunner();
const mysql = require('mysql');

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
    let params = [newName, oldName, gameId];
    let updateNamesSql = mysql.format(UPDATE_TEAM_NAMES_SQL, params);
    await QueryRunner.runQuery(updateNamesSql);
}

let checkIfPredictionTeamNamesNeedToUpdate = async (req) => {
    let params = [req.params["gameId"]];
    let retrieveTeamNamesQuery = mysql.format(SELECT_TEAM_NAMES, params);

    let teamNameResponse = await QueryRunner.runQuery(retrieveTeamNamesQuery);
    let homeTeamName = teamNameResponse[0]["HomeTeamName"];         
    let awayTeamName = teamNameResponse[0]["AwayTeamName"];

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

    let params = [
        req.body["homeTeamName"],
        req.body["awayTeamName"],
        homeTeamScore,
        awayTeamScore,
        req.body["gameDate"] + " 04:00:00",
        req.body["competition"],
        req.params["gameId"]
    ];

    let updateSql = mysql.format(UPDATE_GAME_SQL, params);

    try {
        await QueryRunner.runQuery(updateSql);
        res.status(200).json("Successfully updated game: " + req.params.gameId)
    } catch (error) {
        console.error("Error updating game: " + req.params["gameId"] + ": " + error);
        res.status(500).json("Error updating game");
    }
});