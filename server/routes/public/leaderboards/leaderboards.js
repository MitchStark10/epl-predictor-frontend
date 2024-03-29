const app = module.exports = require('express')();
const mysql = require('mysql');
const QueryRunner = require('../../../service/QueryRunner').buildQueryRunner();

const RETRIEVE_ALL_USERNAMES = `
SELECT DISTINCT Username
FROM USER
`;

const RETRIEVE_ALL_PREDICTIONS_BY_USER = `
SELECT * 
FROM PREDICTION, GAME
WHERE PREDICTION.GameId = GAME.GameId
    AND GAME.HomeTeamScore IS NOT NULL
    AND GAME.AwayTeamScore IS NOT NULL
    AND PREDICTION.Username = ?
ORDER BY GAME.GameDate DESC
`;

app.get('/', async (req, res) => {
    var leaderboardStatsList = [];
    let usernameList = await QueryRunner.runQuery(RETRIEVE_ALL_USERNAMES);

    for (let i = 0; i < usernameList.length; i++) {
        let username = usernameList[i]['Username'];
        let predictionsQuery = mysql.format(RETRIEVE_ALL_PREDICTIONS_BY_USER, username);
        let predictionList = await QueryRunner.runQuery(predictionsQuery);

        leaderboardStatsList.push(processPredictions(predictionList, username));
    }

    leaderboardStatsList = leaderboardStatsList.sort(function (a, b) {
        return b['correctPredictionRate'] - a['correctPredictionRate'];
    });

    for (let i in leaderboardStatsList) {
        leaderboardStatsList[i]['place'] = parseInt(i) + 1;
    }

    res.status(200).json(leaderboardStatsList);
});

const processPredictions = (predictionList, username) => {
    var correctPredictionsCount = 0;
    let totalPredictionsCount = predictionList.length;
    var streakSymbol = '';
    var streakCount = 0;
    var streakBroken = false;

    for (var i = 0; i < predictionList.length; i++) {
        let prediction = predictionList[i];
        let predictedWinner = prediction['WinningTeam'];
        let homeTeamScore = parseInt(prediction['HomeTeamScore']);
        let awayTeamScore = parseInt(prediction['AwayTeamScore']);

        if (homeTeamScore === awayTeamScore && predictedWinner === 'Tie'
            || homeTeamScore > awayTeamScore && predictedWinner === prediction['HomeTeamName']
            || awayTeamScore > homeTeamScore && predictedWinner === prediction['AwayTeamName']) {

            correctPredictionsCount++;

            if ((streakSymbol === 'W' || streakSymbol === '') && !streakBroken) {
                streakSymbol = 'W';
                streakCount++;
            } else {
                streakBroken = true;
            }
        } else if ((streakSymbol === 'L' || streakSymbol === '') && !streakBroken) {
            streakSymbol = 'L';
            streakCount++;
        } else {
            streakBroken = true;
        }
    }

    let correctPredictionRate = (correctPredictionsCount / totalPredictionsCount * 100).toFixed(2);
    console.log(correctPredictionRate);

    if (isNaN(correctPredictionRate)) {
        console.log('here');
        correctPredictionRate = 0;
    }

    return {
        'username': username,
        'correctPredictionCount': correctPredictionsCount,
        'totalPredictionCount': totalPredictionsCount,
        'streak': streakSymbol + streakCount,
        'correctPredictionRate': correctPredictionRate
    };
};