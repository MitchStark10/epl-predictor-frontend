const app = module.exports = require('express')();
const QueryRunner = require('../../service/QueryRunner').buildQueryRunner();

const RETRIEVE_ALL_GAMES_SQL = `
SELECT *
FROM GAME
ORDER BY GameDate DESC
`;

const RETRIEVE_ALL_UPCOMING_GAMES_SQL = `
SELECT * 
FROM GAME 
WHERE GameDate > SYSDATE()
ORDER BY GameDate
`;

const RETRIEVE_ALL_PAST_GAMES_SQL = `
SELECT *
FROM GAME
WHERE GameDate <= SYSDATE()
ORDER BY GameDate DESC
`;

app.get('/retrieveAllUpcomingGames', async (req, res) => {
    try {
        let response = await QueryRunner.runQuery(RETRIEVE_ALL_UPCOMING_GAMES_SQL);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error retrieving all upcoming games: " + error);
        res.status(500).json("Error retrieving all upcoming games");
    }
});

app.get('/retrieveAllPastGames', async (req, res) => {
    try {
        let response = await QueryRunner.runQuery(RETRIEVE_ALL_PAST_GAMES_SQL);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error retrieving all past games: " + error);
        res.status(500).json("Error retrieving all past games");
    }
});

app.get('/retrieveAllGames', async (req, res) => {
    try {
        let response = await QueryRunner.runQuery(RETRIEVE_ALL_GAMES_SQL);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error retrieving all games: " + error);
        res.status(500).json("Error retrieving all games");
    }
});
