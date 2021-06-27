const mysql = require('mysql');
const QueryRunner = require('./QueryRunner').buildQueryRunner();
const PasswordHasher = require('./PasswordHasher')();

const cookieMetadata = { httpOnly: true, sameSite: 'lax', expires: false, maxAge: new Date(253402300000000) };

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

const LOGIN_AND_RETRIEVE_STATUS_SQL = `
SELECT USER.Status
FROM SESSION_COOKIE 
    INNER JOIN USER ON USER.Username = SESSION_COOKIE.Username
WHERE USER.Username = ?
    AND SESSION_COOKIE.SessionCookie = ?
    AND SESSION_COOKIE.Device = ?
`;

const CHECK_IF_USER_EXISTS_SQL = `
SELECT Username
FROM USER
WHERE USER.Email = ?
`;

const UPDATE_SESSION_COOKIE_SQL = `
INSERT INTO SESSION_COOKIE(SessionCookie, Device, Username)
VALUES (?, ?, ?)
ON DUPLICATE KEY UPDATE 
SessionCookie = ?
`;

const NEW_USER_SQL = `
INSERT INTO USER (Username, Password, eMail, IsGoogleUser)
VALUES (?, ?, ?, ?)
`;

module.exports.authorizeUserCredentialsViaCookie = async (req, res, next) => {
    if (req.cookies !== undefined) {
        console.log('Attempting to login with cookies: ' + JSON.stringify(req.cookies));
        let cookieParams = [req.cookies['SMLU'], req.cookies['SMLC'], req.device.type.toUpperCase()];
        let loginWithCookieQuery = mysql.format(LOGIN_WITH_COOKIE_SQL, cookieParams);
        let cookieLoginResponse = await QueryRunner.runQuery(loginWithCookieQuery);
        if (cookieLoginResponse[0]['USER_COUNT'] !== 0) {
            next(req, res);
            return;
        }
    }

    res.status(401).json({ errorMsg: 'User [' + req.cookies['SMLU'] + '] could not be authenticated' });
};

module.exports.authorizeCredentialsForUserModification = async (req, res, username, next) => {
    if (req.cookies !== undefined) {
        console.log('Attempting to login with cookies: ' + JSON.stringify(req.cookies));
        let cookieParams = [req.cookies['SMLU'], req.cookies['SMLC'], req.device.type.toUpperCase()];
        let loginWithCookieQuery = mysql.format(LOGIN_AND_RETRIEVE_USERNAME_SQL, cookieParams);
        let cookieLoginResponse = await QueryRunner.runQuery(loginWithCookieQuery);
        if (cookieLoginResponse[0] && cookieLoginResponse[0]['Username'] === username) {
            next(req, res);
            return;
        }
    }

    // TODO: This will cause a problem if the req.cookies is not defined
    res.status(403).json({ errorMsg: 'User [' + req.cookies['SMLU'] + '] not authorized for ' + username});
};

module.exports.authorizeAdminForAction = async (req, res, next) => {
    if (req.cookies !== undefined) {
        console.log('Attempting to login with cookies: ' + JSON.stringify(req.cookies));
        let cookieParams = [req.cookies['SMLU'], req.cookies['SMLC'], req.device.type.toUpperCase()];
        let retrieveUserInfoQuery = mysql.format(LOGIN_AND_RETRIEVE_STATUS_SQL, cookieParams);
        let userInfoResponse = await QueryRunner.runQuery(retrieveUserInfoQuery);
        if (userInfoResponse[0]['Status'] && userInfoResponse[0]['Status'] === 'admin') {
            next(req, res);
            return;
        }
    }

    res.status(403).json({ errorMsg: 'User [' + req.cookies['SMLU'] + '] is not authorized as admin'});
};

module.exports.doesUserExistWithEmail = async (userEmail) => {
    const userExistsQuery = mysql.format(CHECK_IF_USER_EXISTS_SQL, userEmail);
    const userExistsResponse = await QueryRunner.runQueryWithErrorHandling(userExistsQuery);

    return userExistsResponse && userExistsResponse.length === 1 && userExistsResponse[0].Username;
};

module.exports.createNewUser = async (username, rawPass, email, deviceType, res, isNewUser = false) => {
    let password = PasswordHasher.hashPassword(rawPass);
    let params = [username, password, email, isNewUser];
    let newUserInsert = mysql.format(NEW_USER_SQL, params);

    try {
        await QueryRunner.runQuery(newUserInsert);
        createAndSetSessionCookie(username, rawPass, deviceType, res);
    } catch (error) {
        console.error('Error during new user: ' + error);
    }
};

const createAndSetSessionCookie = (username, password, deviceType, res) => {
    const sessionCookie = PasswordHasher.hashPassword(username + password);
    const insertSessionCookieParams = [sessionCookie, deviceType, username, sessionCookie];
    const insertSessionCookieSql = mysql.format(UPDATE_SESSION_COOKIE_SQL, insertSessionCookieParams);
    QueryRunner.runQuery(insertSessionCookieSql);
    res.cookie('SMLU', username, cookieMetadata);
    res.cookie('SMLC', sessionCookie, cookieMetadata);
};

module.exports.createAndSetSessionCookie = createAndSetSessionCookie;
