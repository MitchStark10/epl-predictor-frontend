const app = module.exports = require('express')();
const QueryRunner = require('../../service/QueryRunner').buildQueryRunner();
const mysql = require('mysql');

const RETRIEVE_PREVIOUS_PREDICTION = `
SELECT COUNT(*) AS PREDICTION_COUNT
FROM PREDICTION
WHERE Username = ?
    AND GameId = ?
`;

const INSERT_PREDICTION_SQL = `
INSERT INTO PREDICTION (Username, GameId, WinningTeam)
VALUES (?, ?, ?);
`;

const UPDATE_PREDICTION_SQL = `
UPDATE PREDICTION 
SET WinningTeam = ?
WHERE Username = ?
    AND GameId = ?
`;

const RETRIEVE_UPCOMING_PREDICTIONS_SQL = `
SELECT PREDICTION.Username, PREDICTION.GameId, PREDICTION.WinningTeam, GAME.GameDate
FROM PREDICTION, GAME
WHERE PREDICTION.Username = ?
    AND PREDICTION.GameID = GAME.GameID
    AND GAME.GameDate > SYSDATE()
`;

const RETRIEVE_PAST_PREDICTIONS_SQL = `
SELECT PREDICTION.Username, PREDICTION.GameId, PREDICTION.WinningTeam, GAME.GameDate
FROM PREDICTION, GAME
WHERE PREDICTION.Username = ?
    AND PREDICTION.GameID = GAME.GameID
    AND GAME.GameDate <= SYSDATE()
`;

let predictionAlreadyExists = async (params) => {
    let retrievePreviousPredictionSql = mysql.format(RETRIEVE_PREVIOUS_PREDICTION, params);

    try {
        let response = await QueryRunner.runQuery(retrievePreviousPredictionSql);
        return response[0]["PREDICTION_COUNT"] !== 0;
    } catch (error) {
        console.log("Error retrieving previous prediction count: " + error);
        return true;
    }
};

let insertNewPrediction = async (params, res) => {
    let addNewPredictionSql = mysql.format(INSERT_PREDICTION_SQL, params);

    try {
        await QueryRunner.runQuery(addNewPredictionSql);
        res.status(200).json("New prediction inserted");
    } catch (error) {
        console.error("Problem inserting new prediction: " + error);
        res.status(500).json("Problem inserting new prediction");
    }
}

let updatePrediction = async (params, res) => {
    let updatePredictionSql = mysql.format(UPDATE_PREDICTION_SQL, params);

    try {
        await QueryRunner.runQuery(updatePredictionSql);
        res.status(200).json("Prediction updated");
    } catch (error) {
        console.error("Problem updating prediction: " + error);
        res.status(500).json("Problem updating prediction");
    }
}

app.post('/addOrUpdatePrediction', async (req, res) => {
    let retrievePreviousPredictionParams = [req.body["username"], req.body["gameId"]];
    let insertParams = [req.body["username"], req.body["gameId"], req.body["winningTeam"]];
    let updateParams = [req.body["winningTeam"], req.body["username"], req.body["gameId"]];

    if (await predictionAlreadyExists(retrievePreviousPredictionParams)) {
        console.log("here");
        updatePrediction(updateParams, res);
    } else {
        insertNewPrediction(insertParams, res);
    }
});

app.get('/upcomingPredictions/:username', async (req, res) => {
    let params = [req.params["username"]];
    let retrievePreidctionsSql = mysql.format(RETRIEVE_UPCOMING_PREDICTIONS_SQL, params);

    try {
        let response = await QueryRunner.runQuery(retrievePreidctionsSql);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error retrieving upcoming predictions: " + error);
        res.status(500).json("Error retrieving upcoming predictions");
    }
});

app.get('/previousPredictions/:username', async (req, res) => {
    let params = [req.params["username"]];
    let retrievePreidctionsSql = mysql.format(RETRIEVE_PAST_PREDICTIONS_SQL, params);

    try {
        let response = await QueryRunner.runQuery(retrievePreidctionsSql);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error retrieving past predictions: " + error);
        res.status(500).json("Error retrieving past predictions");
    }

});