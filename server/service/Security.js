const mysql = require('mysql');
const QueryRunner = require('./QueryRunner').buildQueryRunner();

const LOGIN_WITH_COOKIE_SQL = `
SELECT COUNT(*) AS USER_COUNT
FROM SESSION_COOKIE
WHERE Username = ?
    AND SessionCookie = ?
    AND Device = ?
`;

const LOGIN_AND_RETRIEVE_USERNAME_SQL = `
SELECT Username
FROM SESSION_COOKIE
WHERE Username = ?
    AND SessionCookie = ?
    AND Device = ?
`;

module.exports.authorizeUserCredentialsViaCookie = async (req, res, next) => {
    if (req.cookies !== undefined) {
        console.log("Attempting to login with cookies: " + JSON.stringify(req.cookies));
        let cookieParams = [req.cookies["SMLU"], req.cookies["SMLC"], req.device.type.toUpperCase()];
        let loginWithCookieQuery = mysql.format(LOGIN_WITH_COOKIE_SQL, cookieParams);
        let cookieLoginResponse = await QueryRunner.runQuery(loginWithCookieQuery);
        if (cookieLoginResponse[0]["USER_COUNT"] !== 0) {
            next(req, res);
            return;
        }
    }

    res.status(401).json({ errorMsg: "User [" + req.cookies["SMLU"] + "] could not be authenticated" });
}

module.exports.authorizeCredentialsForUserModification = async (req, res, username, next) => {
    if (req.cookies !== undefined) {
        console.log("Attempting to login with cookies: " + JSON.stringify(req.cookies));
        let cookieParams = [req.cookies["SMLU"], req.cookies["SMLC"], req.device.type.toUpperCase()];
        let loginWithCookieQuery = mysql.format(LOGIN_WITH_COOKIE_SQL, cookieParams);
        let cookieLoginResponse = await QueryRunner.runQuery(loginWithCookieQuery);
        if (cookieLoginResponse[0]["Username"] && cookieLoginResponse[0]["Username"] === username) {
            next(req, res);
            return;
        }
    }

    res.status(403).json({ errorMsg: "User [" + req.cookies["SMLU"] + "not authorized for " + username });
}
