const app = module.exports = require('express')();
const Collections = require('../../database/Collections');
const MongoClientWrapper = require('../../service/MongoClientWrapper');
const ObjectId = require('mongodb').ObjectId; 
const mongoClient = new MongoClientWrapper();

app.get('/', async (req, res) => {
    try {
        var leaderboardStatsList = [];
        let usernameList = await mongoClient.runQuery(Collections.USERS, null);

        for (var i = 0; i < usernameList.length; i++) {
            const username = usernameList[i]["username"];
            let userPredictionSearch = {
                username: username
            };

            let predictionList = await mongoClient.runQuery(Collections.PREDICTIONS, userPredictionSearch);

            leaderboardStatsList.push(await processPredictions(predictionList, username, i + 1));
        }

        leaderboardStatsList = leaderboardStatsList.sort(function (a, b) {
            return b["correctPredictionRate"] - a["correctPredictionRate"];
        });

        res.status(200).json(leaderboardStatsList);
    } catch (exception) {
        console.log("Encountered exception retrieving leaderboards: " + exception + " - " + exception.stack);
        res.status(500).json({ errorMsg: "Unable to retrieve leaderboards" });
    }
});

processPredictions = async (predictionList, username, place) => {
    var correctPredictionsCount = 0;
    let totalPredictionsCount = 0;
    var streakSymbol = "";
    var streakCount = 0;
    var streakBroken = false;
    const gameCache = {};

    for (var i = 0; i < predictionList.length; i++) {
        let prediction = predictionList[i];
        let game = await retrieveGame(prediction["gameId"], gameCache);
        let predictedWinner = prediction["winningTeam"];
        let homeTeamScore = parseInt(game["homeTeamScore"]);
        let awayTeamScore = parseInt(game["awayTeamScore"]);

        if (Number.isNaN(homeTeamScore) || Number.isNaN(awayTeamScore)) {
            continue;
        }

        totalPredictionsCount++;

        if ((homeTeamScore === awayTeamScore && predictedWinner === "Tie")
            || (homeTeamScore > awayTeamScore && predictedWinner === game["homeTeamName"])
            || (awayTeamScore > homeTeamScore && predictedWinner === game["awayTeamName"])) {

            correctPredictionsCount++;

            if ((streakSymbol === "W" || streakSymbol === "") && !streakBroken) {
                streakSymbol = "W";
                streakCount++;
            } else {
                streakBroken = true;
            }
        } else if ((streakSymbol === "L" || streakSymbol === "") && !streakBroken) {
            streakSymbol = "L";
            streakCount++;
        } else {
            streakBroken = true;
        }
    }

    return {
        "username": username,
        "correctPredictionCount": correctPredictionsCount,
        "totalPredictionCount": totalPredictionsCount,
        "streak": streakSymbol + streakCount,
        "correctPredictionRate": ((correctPredictionsCount / totalPredictionsCount) * 100).toFixed(2),
        "place": place
    };
}

retrieveGame = async (gameId, gameCache) => {
    if (gameCache[gameId] !== null && gameCache[gameId] !== undefined) {
        return gameCache[gameId];
    }

    const gameSearchObj = {
        _id: ObjectId(gameId)
    };

    const gameData = await mongoClient.runSingleObjectQuery(Collections.GAMES, gameSearchObj);
    gameCache[gameId] = gameData;
    return gameData;
};