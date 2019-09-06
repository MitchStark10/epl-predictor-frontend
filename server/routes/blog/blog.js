const app = module.exports = require('express')();
const QueryRunner = require('../../service/QueryRunner').buildQueryRunner();
const mysql = require('mysql');
const Collections = require('../../database/Collections');
const BlogPost = require('../../database/BlogPost');
const MongoClientWrapper = require('../../service/MongoClientWrapper');
const mongoClient = new MongoClientWrapper();

const INSERT_NEW_BLOG_POST_SQL = `
INSERT INTO BLOG_POST(PostTitle, PostData, ViewCount, Username, GameId, BlogPostType)
VALUES (?, ?, 0, ?, ?, ?)
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

app.post('/addNewBlogPost', async (req, res) => {
    console.log("Entered add new blog post");

    try {

        if (req.body.blogPostType === "PREDICTION") {
            let currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            let gameQueryObject = {
                gameId: req.body.gameId
            };

            let gameDateResponse = await mongoClient.runQuery(Collections.GAMES, gameQueryObject);

            let gameDate = new Date(Date.parse(gameDateResponse["gameDate"]));
            gameDate.setHours(0, 0, 0, 0);

            if (currentDate >= gameDate) {
                res.status(400).json({errorMsg: "You cannot add a prediction post on or after they day of the game"});
                return;
            }
        }

        let predictionQueryObject = {
            gameId: req.body.gameId,
            username: req.body.username
        };

        let predictionResponse = await mongoClient.runSingleObjectQuery(Collections.USERS, predictionQueryObject);

        if (predictionResponse !== null && predictionResponse !== undefined) {
            const blogPostToInsert = new BlogPost(req.body.blogPostTitle, req.body.blogPostData, 0, 
                req.body.username, req.body.gameId, req.body.blogPostType, new Date());
            await mongoClient.runInsert(blogPostToInsert);
            res.status(200).json("Successfully added new blog post")
        } else {
            res.status(400).json({errorMsg: "You cannot add a new blog post for a game that you have not predicted."})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json("Unable to insert new blog post");
    }

    console.log("Exiting add new blog post");
});

//TODO: Convert
// app.post('/updateBlogPost', async (req, res) => {
//     console.log("Entering updateBlogPost");

//     try {
//         let params = [req.body.blogPostTitle, req.body.blogPostData, req.body.blogPostId];
//         let editGameSql = mysql.format(EDIT_BLOG_POST_SQL, params);
//         await QueryRunner.runQuery(editGameSql);
//         res.status(200).json("Successfully saved blog post edits");
//     } catch (error) {
//         console.log(error);
//         res.status(500).json("Unable to edit blog post");
//     }
    
//     console.log("Exiting updateBlogPost");
// });

//TODO: Convert
// app.post('/likeBlogPost', async (req, rexs) => {
//     console.log("Entering likeBlogPost/");

//     try {
//         let params = [req.body.blogPostId, req.body.username];
//         let insertLikeSql = mysql.format(ADD_LIKE_SQL, params);
//         await QueryRunner.runQuery(insertLikeSql);
//         res.status(200).json("Successfully liked blog post");
//     } catch (error) {
//         console.log(error);
//         res.status(500).json("Unable to like post");
//     }

//     console.log("Exiting likeBlogPost");
// });

app.get('/retrieveAllBlogPostHeaders/:blogPostType/:blogPostGameId', async (req, res) => {
    console.log("Entering retrieveAllBlogPostHeaders");

    try {
        let queryObject = {
            gameId: req.params.blogPostGameId,
            blogPostType: req.params.blogPostType
        };

        let blogResults = await mongoClient.runQuery(Collections.BLOG_POSTS, queryObject);
        res.status(200).json(blogResults);
    } catch (error) {
        console.log(error);
        res.status(500).json("Unable to retrieve blog post headers");
    }

    console.log("Exiting retrieveAllBlogPostHeaders");
});

app.get('/retrieveTeamNames/:gameId', async (req, res) => {
    console.log("Entering /retrieveTeamNames/" + req.params.gameId);

    try {
        let queryForTeamNamesObject = {
            gameId: req.params.gameId
        };

        let teamNamesResponse = await mongoClient.runSingleObjectQuery(Collections.GAMES, queryForTeamNamesObject);
        res.status(200).json(teamNamesResponse);
    } catch (error) {
        console.log(error);
        res.status(500).json("Unable to retrieve team names for game id: " + req.params.gameId);
    }

    console.log("Exiting /retrieveTeamNames/" + req.params.gameId);
});

app.get('/retrieveBlogPost/:blogPostId', async (req, res) => {
    console.log("Entering retrieveBlogPost/" + req.params.blogPostId);

    try {
        let searchObject = {
            postId: req.params.blogPostId
        };

        let blogPostData = await mongoClient.runSingleObjectQuery(Collections.BLOG_POSTS, searchObject);

        //TODO: Convert to mongo query:  QueryRunner.runQuery(addViewSql);
        res.status(200).json(blogPostData.postData);
    } catch (error) {
        console.log(error);
        res.status(500).json("Unable to retrieve blog post");
    }

    console.log("Exiting retrieveBlogPost/" + req.params.blogPostId);
});

// app.delete('/deleteBlogPost/:blogPostId', async (req, res) => {
//     console.log("Entering deleteBlogPost/" + req.params.blogPostId);

//     try {
//         let params = [req.params.blogPostId];
//         let deleteSql = mysql.format(DELETE_BLOG_POST_SQL, params);
//         await QueryRunner.runQuery(deleteSql);
//         res.status(200).json("Deleted blog post");
//     } catch (error) {
//         console.log(error);
//         res.status(500).json("Unable to delete blog post");
//     }

//     console.log("Exiting deleteBlogPost/" + req.params.blogPostId);
// });