const app = module.exports = require('express')();
const QueryRunner = require('../../../service/QueryRunner').buildQueryRunner();
const Security = require('../../../service/Security');
const mysql = require('mysql');

const UPSERT_PREDICION_SQL = `
INSERT INTO PREDICTION
(Username, GameId, WinningTeam)
VALUES( ?, ?, ?)
ON DUPLICATE KEY UPDATE
WinningTeam = ?
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

app.post('/addOrUpdatePrediction', async (req, res) => {
    const putPrediction = async (req, res) => {
        try {
            let upsertParams = [req.body["username"], req.body["gameId"], req.body["winningTeam"], req.body["winningTeam"]];
            let upsertPrediction = mysql.format(UPSERT_PREDICION_SQL, upsertParams);
            QueryRunner.runQuery(upsertPrediction);
            res.status(200).json("Prediction updated");
        } catch(error) {
            console.error("Problem updating prediction: " + error);
            res.status(500).json("Problem updating prediction");
        }
    };
    Security.authorizeCredentialsForUserModification(req, res, req.body["username"], putPrediction);
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
