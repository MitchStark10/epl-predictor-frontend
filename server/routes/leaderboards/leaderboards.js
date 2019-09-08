const app = module.exports = require('express')();
const Collections = require('../../database/Collections');
const MongoClientWrapper = require('../../service/MongoClientWrapper');
const mongoClient = new MongoClientWrapper();

app.get('/', async (req, res) => {
    var leaderboardStatsList = [];
    let usernameList = await mongoClient.runQuery(Collections.USERS, null);
    
    for (var i = 0; i < usernameList.length; i++) {
        let userPredictionSearch = {
            username: usernameList[i]["username"]
        };

        let predictionList = await mongoClient.runQuery(Collections.PREDICTIONS, userPredictionSearch);
        
        leaderboardStatsList.push(processPredictions(predictionList, username, i + 1));
    }

    leaderboardStatsList = leaderboardStatsList.sort(function(a, b) {
        return b["correctPredictionRate"] - a["correctPredictionRate"];
    });

    res.status(200).json(leaderboardStatsList);
});

processPredictions = (predictionList, username, place) => {
    var correctPredictionsCount = 0;
    let totalPredictionsCount = predictionList.length;
    var streakSymbol = "";
    var streakCount = 0;
    var streakBroken = false;

    for (var i = 0; i < predictionList.length; i++) {
        let prediction = predictionList[i];
        let predictedWinner = prediction["winningTeam"];
        let homeTeamScore = parseInt(prediction["homeTeamScore"]);
        let awayTeamScore = parseInt(prediction["awayTeamScore"]);

        if ((homeTeamScore === awayTeamScore && predictedWinner === "Tie")
            || (homeTeamScore > awayTeamScore && predictedWinner === prediction["homeTeamName"])
            || (awayTeamScore > homeTeamScore && predictedWinner === prediction["awayTeamName"])) {

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