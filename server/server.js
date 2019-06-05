const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require("path");
const routes = require('./routes');

// parse application/x-www-9form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());


//Retrieve All Games and return as JSON Array
app.get('/retrieveAllGames', (req, res) => {
    GameRetrieverService.retrieveAllGames(res);
});

//Retrieve the success rates of our prediction service
//sucessRate - The rate of which the app predicted the correct score differential
//correctGameOutcomeRate - The rate at which the app predicted the correct winner of the match
//failRate - The rate at which both the score and the outcome were not predicted correctly
app.get('/retrievePredictionSuccessRate', (req, res) => {
    PredictionSuccessRateService.retrievePredictionRates(res);
})

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "../build/")));
}

app.use(routes);

app.listen(process.env.PORT || 8080, () => console.log('EPL Predictor Server app listening on port 8080!'))