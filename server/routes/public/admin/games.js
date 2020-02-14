const app = module.exports = require('express')();
const QueryRunner = require('../../../service/QueryRunner').buildQueryRunner();
const Security = require('../../../service/Security');
const mysql = require('mysql');

const INSERT_GAME_SQL = `
INSERT INTO GAME (HomeTeamName, AwayTeamName, GameDate, Competition)
VALUES (?, ?, ?, ?);
`;

const SELECT_ID_SQL = `
SELECT LAST_INSERT_ID() AS ID;
`;

app.post('/addNewGame', async (req, res) => {
    let addNewGame = async (req, res) => {
        let inserts = [req.body['homeTeamName'], req.body['awayTeamName'], req.body['gameDate'] + " 06:00:00", req.body['competition']];
        let addNewGameSql = mysql.format(INSERT_GAME_SQL, inserts);

        try {
            await QueryRunner.runQuery(addNewGameSql);
            let idJson = await QueryRunner.runQuery(SELECT_ID_SQL);
            res.status(200).json(idJson);
        } catch (error) {
            console.error("Problem inserting new game: " + error);
            res.status(500).json("Problem inserting new game");
        }
    };

    Security.authorizeAdminForAction(req, res, addNewGame);
});