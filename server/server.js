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

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../build/")));
}

app.use("/api", routes);

// the catch all route
if (process.env.NODE_ENV === "production") {
    app.all('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/../build/index.html'));
    });
}

app.listen(process.env.PORT || 8080, () => console.log('EPL Predictor Server app listening on port 8080!'))