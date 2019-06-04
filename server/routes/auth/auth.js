const app = module.exports = require('express')();
const mysql = require('mysql');
const QueryRunner = require('../../service/QueryRunner').buildQueryRunner();
const bcrypt = require('bcrypt-nodejs');
const PasswordHasher = require('../../service/PasswordHasher')();

const LOGIN_SQL = `
SELECT Password
FROM USER
WHERE Username = ?
`;

const LOGIN_WITH_COOKIE_SQL = `
SELECT COUNT(*) AS USER_COUNT
FROM USER
WHERE Username = ?
    AND SessionCookie = ?
`;

const NEW_USER_SQL = `
INSERT INTO USER (Username, Password, eMail)
VALUES (?, ?, ?)
`;

const UPDATE_SESSION_COOKIE_SQL =`
UPDATE USER SET SessionCookie = ? WHERE Username = ?
`;

const GET_STATUS_SQL = `
SELECT Status
FROM USER
WHERE Username = ?
`;

app.post('/login', async (req, res) => {
    try {
        if (req.cookies !== undefined) {
            console.log("Attempting to login with cookies: " + JSON.stringify(req.cookies));
            let username = req.cookies["SMLU"];
            let cookieParams = [req.cookies["SMLU"], req.cookies["SMLC"]];
            let loginWithCookieQuery = mysql.format(LOGIN_WITH_COOKIE_SQL, cookieParams);
            let cookieLoginResponse = await QueryRunner.runQuery(loginWithCookieQuery);
            if (cookieLoginResponse[0]["USER_COUNT"] !== 0) {
                res.status(200).json({username: req.cookies["SMLU"]});
                return;
            }
        }

        let params = [req.body["username"]];
        let loginQuery = mysql.format(LOGIN_SQL, params);

        let userLoginResponseArray = await QueryRunner.runQuery(loginQuery);

        if (userLoginResponseArray.length > 1) {
            console.error("Multiple users of the same name were found during login: " + req.body["username"]);
            res.status(500).json("Multiple users of the same name were found during login");
            return;
        } else if (userLoginResponseArray < 1) {
            res.status(403).json("Username [" + req.body["username"] + "] does not exist");
            return;
        }

        let userLoginResponse = userLoginResponseArray[0];

        if (bcrypt.compareSync(req.body["password"], userLoginResponse["Password"])) {
            let sessionCookie = PasswordHasher.hashPassword(req.body["username"] + req.body["password"] + new Date());
            let insertSessionCookieParams = [sessionCookie, req.body["username"]];
            let insertSessionCookieSql = mysql.format(UPDATE_SESSION_COOKIE_SQL, insertSessionCookieParams);
            let cookieMetadata = { httpOnly: true }
            QueryRunner.runQuery(insertSessionCookieSql);
            res.cookie('SMLU', req.body["username"], cookieMetadata);
            res.cookie('SMLC', sessionCookie, cookieMetadata);
            res.status(200).json({username: req.body["username"]});
        } else {
            console.warn("Password did not match for user: " + req.body["username"]);
            res.status(401).json("Username or Password did not match");
        }

    } catch (error) {
        console.error("Error during login: " + error);
        res.status(500).json("Error occurred during the login");
    }
});

app.post('/logout', async (req, res) => {
    res.clearCookie('SMLU');
    res.clearCookie('SMLC');
    res.status(200).json('Logout completed');
});

app.post('/newUser', async (req, res) => {
    let password = PasswordHasher.hashPassword(req.body["password"]);
    let params = [req.body["username"], password, req.body["email"]];
    let newUserInsert = mysql.format(NEW_USER_SQL, params);

    try {
        await QueryRunner.runQuery(newUserInsert);
        //TODO: Cookie
        res.status(200).json("New user created");
    } catch (error) {
        //TODO: Display if user already exists
        console.error("Error during new user: " + error);
        res.status(500).json("Error occurred creating the new user");
    }

});

app.post('/getUserStatus', async (req, res) => {
    let params = [req.body["userToken"]];
    let getStatusQuery = mysql.format(GET_STATUS_SQL, params);

    try {
        let statusJson = await QueryRunner.runQuery(getStatusQuery);
        res.status(200).json(statusJson[0]);
    } catch (error) {
        console.log("Error retrieving status: " + error);
        res.status(500).json("Unable to retrieve user status");
    }
})