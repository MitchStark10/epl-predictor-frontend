const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Retrieve All Games and return as JSON Array
app.get('/ping', (req, res) => {
    res.send("pong");
});

app.listen(process.env.PORT || 8080, () => console.log('EPL Predictor Server app listening on port 8080!'))