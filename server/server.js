const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require("path");
const routes = require('./routes');
const device = require('express-device');

// parse application/x-www-9form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(device.capture());


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
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../build/")));
}

app.use("/api", routes);

// the catch all route
if (process.env.NODE_ENV === "production") {
    console.log("Setting all route");
    app.all('*', (req, res) => {
        console.log("in here yo");
        res.sendFile(path.join(__dirname + '/../build/index.html'));
    });
}

app.listen(process.env.PORT || 8080, () => console.log('EPL Predictor Server app listening on port 8080!'))