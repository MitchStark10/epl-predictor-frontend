const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.CORS_ACCEPT_HOST);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(routes);

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

app.listen(process.env.PORT || 8080, () => console.log('EPL Predictor Server app listening on port 8080!'))