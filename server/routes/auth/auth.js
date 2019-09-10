const app = module.exports = require('express')();
const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
const PasswordHasher = require('../../service/PasswordHasher')();
const User = require('../../database/User');
const Collections = require('../../database/Collections');
const MongoClientWrapper = require('../../service/MongoClientWrapper');
const mongoClient = new MongoClientWrapper();

app.post('/login', async (req, res) => {
    try {
        console.log("Logging in with device: " + JSON.stringify(req.device));
        if (req.cookies !== undefined) {
            console.log("Attempting to login with cookies: " + JSON.stringify(req.cookies));

            let loginWithCookieQuery = {
                username: req.cookies["SMLU"],
                sessionCookie: req.cookies["SMLC"],
                device: req.device.type.toUpperCase()
            };

            let cookieLoginResponse = await mongoClient.runSingleObjectQuery(Collections.USERS, loginWithCookieQuery);

            if (cookieLoginResponse !== null && cookieLoginResponse !== undefined) {
                res.status(200).json({username: req.cookies["SMLU"]});
                return;
            }
        }

        let loginQueryObject = {
            username: req.body["username"]
        };

        let userLoginResponse = await mongoClient.runSingleObjectQuery(Collections.USERS, loginQueryObject);

        if (userLoginResponse === null || userLoginResponse === undefined) {
            res.status(403).json("Username [" + req.body["username"] + "] does not exist");
            return;
        }

        if (bcrypt.compareSync(req.body["password"], userLoginResponse["password"])) {
            let sessionCookie = PasswordHasher.hashPassword(req.body["username"] + req.body["password"]);

            let queryObject = {
                username: req.body["username"],
                device: req.device.type.toUpperCase()
            };

            let insertCookieObject = {
                username: req.body["username"],
                sessionCookie: sessionCookie,
                device: req.device.type.toUpperCase()
            };

            let cookieMetadata = { httpOnly: true, sameSite: 'lax', expires: false, maxAge: new Date(253402300000000) }
            await mongoClient.runUpdate(Collections.SESSION_COOKIES, queryObject, insertCookieObject, true);

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

    //TODO: Immediately insert session cookie
    let newUserToInsert = new User(req.body["username"], password, req.body["email"], null, null);

    try {
        await mongoClient.runInsert(Collections.USERS, newUserToInsert);
        //TODO: Cookie
        res.status(200).json("New user created");
    } catch (error) {
        console.error("Error during new user: " + error);
        res.status(500).json("Error occurred creating the new user");
    }
});

app.post('/getUserStatus', async (req, res) => {
    let queryObject = {
        username: req.body["userToken"]
    };

    try {
        let userFound = await mongoClient.runSingleObjectQuery(Collections.USERS, queryObject);

        if (userFound !== null && userFound !== undefined) {
            res.status(200).json(
                {
                    status: userFound["status"]
                }
            );
        } else {
            res.status(404).json("Username [" + req.body["userToken"] + "] was not found");   
        }

    } catch (error) {
        console.log("Error retrieving status: " + error);
        res.status(500).json("Unable to retrieve user status");
    }
})