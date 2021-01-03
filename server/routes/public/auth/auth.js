const app = module.exports = require('express')();
const mysql = require('mysql');
const QueryRunner = require('../../..//service/QueryRunner').buildQueryRunner();
const bcrypt = require('bcrypt-nodejs');
const PasswordHasher = require('../../../service/PasswordHasher')();
const Security = require('../../../service/Security');

const LOGIN_SQL = `
SELECT Password
FROM USER
WHERE Username = ?
`;

const LOGIN_WITH_COOKIE_SQL = `
SELECT COUNT(*) AS USER_COUNT
FROM SESSION_COOKIE
WHERE Username = ?
    AND SessionCookie = ?
    AND Device = ?
`;

const NEW_USER_SQL = `
INSERT INTO USER (Username, Password, eMail)
VALUES (?, ?, ?)
`;

const GET_STATUS_SQL = `
SELECT Status
FROM USER
WHERE Username = ?
`;

const UPDATE_USERNAME_SQL = `
UPDATE USER
SET Username = ?
WHERE eMail = ?
`;

app.post('/login', async (req, res) => {
    try {
        console.log("Logging in with device: " + JSON.stringify(req.device));
        if (req.cookies !== undefined) {
            console.log("Attempting to login with cookies: " + JSON.stringify(req.cookies));
            let cookieParams = [req.cookies["SMLU"], req.cookies["SMLC"], req.device.type.toUpperCase()];
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

        if (bcrypt.compareSync(req.body["password"], userLoginResponse["Password"]) && req.body.password !== 'GOOGLEPASS') {
            Security.createAndSetSessionCookie(req.body["username"], req.body["password"], req.device.type.toUpperCase(), res);
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
    if (req.body["password"] === 'GOOGLEPASS') {
        res.status(400).json("Invalid password text");
    }

    let password = PasswordHasher.hashPassword(req.body["password"]);
    let params = [req.body["username"], password, req.body["email"]];
    let newUserInsert = mysql.format(NEW_USER_SQL, params);

    try {
        await QueryRunner.runQuery(newUserInsert);
        Security.createAndSetSessionCookie(req.body["username"], req.body["password"], req.device.type.toUpperCase(), res);
        res.status(200).json("New user created");
    } catch (error) {
        console.error("Error during new user: " + error);
        res.status(500).json("Error occurred creating the new user");
    }

});

app.post('/updateUsername', async (req, res) => {
	
	const updateUsernameFn = async (req, res) => {
	    console.log('Requested username update: ' + req.body.newUsername);
	    const params = [req.body.newUsername, req.body.currentUsername];
	    const updateUsernameQuery = mysql.format(UPDATE_USERNAME_SQL, params);
        const updatePredictionsQuery = mysql.format(UPDATE_PREDICTIONS_TO_NEW_USERNAME, params);
	    try {
	        await QueryRunner.runQuery(updateUsernameQuery);
	        res.status(200).json({
	            success: true
	        });
	    } catch (error) {
	        // TODO: Catch error related to existing username
	        console.error('Error updating username: ' + error);
	        res.status(500).json({
	            success: false,
	            message: error.toString()
	        });
	    }	
	};
	
    Security.authorizeCredentialsForUserModification(req, res, req.body["currentUsername"], updateUsernameFn);
});

app.post('/getUserStatus', async (req, res) => {
    console.log('entered getUserStatus');
    let params = [req.body["userToken"]];
    let getStatusQuery = mysql.format(GET_STATUS_SQL, params);

    try {
        let statusJson = await QueryRunner.runQuery(getStatusQuery);
        if (statusJson[0]) {
            res.status(200).json(statusJson[0]);
        } else {
            res.status(200).json("");
        }
    } catch (error) {
        console.log("Error retrieving status: " + error);
        res.status(500).json("Unable to retrieve user status");
    }
})
