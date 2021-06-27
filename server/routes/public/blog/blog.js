const app = module.exports = require('express')();
const QueryRunner = require('../../../service/QueryRunner').buildQueryRunner();
const Security = require('../../../service/Security');
const mysql = require('mysql');

const INSERT_NEW_BLOG_POST_SQL = `
INSERT INTO BLOG_POST(PostTitle, PostData, ViewCount, Username, GameId, BlogPostType)
VALUES (?, ?, 0, ?, ?, ?)
`;

const ADD_LIKE_SQL = `
INSERT INTO BLOG_POST_LIKE(PostId, Username)
VALUES (?, ?)
`;

const RETRIEVE_BLOG_POST_HEADERS_SQL = `
SELECT PostId, PostTitle, Username
FROM BLOG_POST
WHERE BlogPostType = ?
    AND GameId = ?
`;

const RETRIEVE_BLOG_POST_SQL = `
SELECT PostId, 
    PostTitle, 
    CONVERT(PostData USING utf8) AS PostData, 
    ViewCount, 
    Username
FROM BLOG_POST
WHERE PostId = ?
`;

const RETRIEVE_ALL_BLOG_POSTS_SQL = `
SELECT PostId, PostTitle, Username
FROM BLOG_POST
ORDER BY EditTime DESC
LIMIT 50
`;

const EDIT_BLOG_POST_SQL = `
UPDATE BLOG_POST
SET PostTitle = ?,
    PostData = ?
WHERE PostId = ?
`;

const ADD_BLOG_POST_VIEW_SQL = `
UPDATE BLOG_POST
SET ViewCount = ViewCount + 1
WHERE PostId = ?
`;

const DELETE_BLOG_POST_SQL = `
DELETE FROM BLOG_POST WHERE PostId = ?
`;

const CHECK_IF_PREDICTION_EXISTS_FOR_USER_AND_GAME_SQL = `
SELECT COUNT(*) AS PREDICTION_COUNT
FROM PREDICTION
WHERE GameId = ?
    AND Username = ?
`;

const GET_GAME_DATE_SQL = `
SELECT GameDate
FROM GAME
WHERE GameId = ?
`;

const GET_TEAM_NAMES_SQL = `
SELECT HomeTeamName, AwayTeamName
FROM GAME 
WHERE GameId = ?
`;

app.post('/addNewBlogPost', async (req, res) => {
    let addNewBlogPost = async () => {
        console.log('Entered add new blog post');

        try {

            if (req.body.blogPostType === 'PREDICTION') {
                let currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);

                let getDateParams = [req.body.gameId];
                let getGameDateSql = mysql.format(GET_GAME_DATE_SQL, getDateParams);
                let gameDateResponse = await QueryRunner.runQuery(getGameDateSql);

                let gameDate = new Date(Date.parse(gameDateResponse[0]['GameDate']));
                gameDate.setHours(0, 0, 0, 0);

                if (currentDate >= gameDate) {
                    res.status(400).json({ errorMsg: 'You cannot add a prediction post on or after they day of the game' });
                    return;
                }
            }

            let checkPredictionParams = [req.body.gameId, req.body.username];
            let checkPredictionSql = mysql.format(CHECK_IF_PREDICTION_EXISTS_FOR_USER_AND_GAME_SQL, checkPredictionParams);
            let countResponse = await QueryRunner.runQuery(checkPredictionSql);
            let count = countResponse[0]['PREDICTION_COUNT'];

            if (count === 1) {
                let params = [req.body.blogPostTitle, req.body.blogPostData, req.body.username, req.body.gameId, req.body.blogPostType];
                let insertBlogPostSql = mysql.format(INSERT_NEW_BLOG_POST_SQL, params);
                await QueryRunner.runQuery(insertBlogPostSql);
                res.status(200).json('Successfully added new blog post');
            } else {
                res.status(400).json({ errorMsg: 'You cannot add a new blog post for a game that you have not predicted.' });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json('Unable to insert new blog post');
        }

        console.log('Exiting add new blog post');

    };

    Security.authorizeUserCredentialsViaCookie(req, res, addNewBlogPost);

});

app.post('/updateBlogPost', async (req, res) => {
    let updateBlogPost = async () => {
        console.log('Entering updateBlogPost');

        try {
            let params = [req.body.blogPostTitle, req.body.blogPostData, req.body.blogPostId];
            let editGameSql = mysql.format(EDIT_BLOG_POST_SQL, params);
            await QueryRunner.runQuery(editGameSql);
            res.status(200).json('Successfully saved blog post edits');
        } catch (error) {
            console.log(error);
            res.status(500).json('Unable to edit blog post');
        }

        console.log('Exiting updateBlogPost');
    };

    Security.authorizeUserCredentialsViaCookie(req, res, updateBlogPost);
});

app.post('/likeBlogPost', async (req, res) => {
    let likeBlogPost = async () => {
        console.log('Entering likeBlogPost/');

        try {
            let params = [req.body.blogPostId, req.body.username];
            let insertLikeSql = mysql.format(ADD_LIKE_SQL, params);
            await QueryRunner.runQuery(insertLikeSql);
            res.status(200).json('Successfully liked blog post');
        } catch (error) {
            console.log(error);
            res.status(500).json('Unable to like post');
        }

        console.log('Exiting likeBlogPost');
    };

    Security.authorizeUserCredentialsViaCookie(req, res, likeBlogPost);

});

app.get('/retrieveAllBlogPostHeaders/:blogPostType/:blogPostGameId', async (req, res) => {
    console.log('Entering retrieveAllBlogPostHeaders');

    try {
        let params = [req.params.blogPostType, req.params.blogPostGameId];
        let retrieveQuery = mysql.format(RETRIEVE_BLOG_POST_HEADERS_SQL, params);
        let blogResults = await QueryRunner.runQuery(retrieveQuery);
        res.status(200).json(blogResults);
    } catch (error) {
        console.log(error);
        res.status(500).json('Unable to retrieve blog post headers');
    }

    console.log('Exiting retrieveAllBlogPostHeaders');
});

app.get('/retrieveAllBlogPostHeaders', async (req, res) => {
    console.log('Entering retrieveAllBlogPostHeaders');
    try {
        let response = await QueryRunner.runQuery(RETRIEVE_ALL_BLOG_POSTS_SQL);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({errorMsg: 'Unable to retrieve all blog post headers'});
    }
    console.log('Entering retrieveAllBlogPostHeaders');
});

app.get('/retrieveTeamNames/:gameId', async (req, res) => {
    console.log('Entering /retrieveTeamNames/' + req.params.gameId);

    try {
        let getTeamNameParams = [req.params.gameId];
        let getTeamNamesQuery = mysql.format(GET_TEAM_NAMES_SQL, getTeamNameParams);
        let teamNamesResponse = await QueryRunner.runQuery(getTeamNamesQuery);
        res.status(200).json(teamNamesResponse[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json('Unable to retrieve team names for game id: ' + req.params.gameId);
    }

    console.log('Exiting /retrieveTeamNames/' + req.params.gameId);
});

app.get('/retrieveBlogPost/:blogPostId', async (req, res) => {
    console.log('Entering retrieveBlogPost/' + req.params.blogPostId);

    try {
        let params = [req.params.blogPostId];
        let retrieveBlogQuery = mysql.format(RETRIEVE_BLOG_POST_SQL, params);
        let blogPostData = await QueryRunner.runQuery(retrieveBlogQuery);

        let addViewSql = mysql.format(ADD_BLOG_POST_VIEW_SQL, params);
        QueryRunner.runQuery(addViewSql);
        res.status(200).json(blogPostData[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json('Unable to retrieve blog post');
    }

    console.log('Exiting retrieveBlogPost/' + req.params.blogPostId);
});

app.delete('/deleteBlogPost/:blogPostId', async (req, res) => {
    console.log('Entering deleteBlogPost/' + req.params.blogPostId);

    try {
        let params = [req.params.blogPostId];
        let deleteSql = mysql.format(DELETE_BLOG_POST_SQL, params);
        await QueryRunner.runQuery(deleteSql);
        res.status(200).json('Deleted blog post');
    } catch (error) {
        console.log(error);
        res.status(500).json('Unable to delete blog post');
    }

    console.log('Exiting deleteBlogPost/' + req.params.blogPostId);
});
