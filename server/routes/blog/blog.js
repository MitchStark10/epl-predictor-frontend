const app = module.exports = require('express')();
const Collections = require('../../database/Collections');
const BlogPost = require('../../database/BlogPost');
const MongoClientWrapper = require('../../service/MongoClientWrapper');
const ObjectId = require('mongodb').ObjectId; 
const mongoClient = new MongoClientWrapper();

app.post('/addNewBlogPost', async (req, res) => {
    console.log("Entered add new blog post");

    try {
        //Ensure that the prediction is occurring before the day of the game
        if (req.body.blogPostType === "PREDICTION") {
            let currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            let gameQueryObject = {
                _id: ObjectId(req.body.gameId)
            };

            let gameDateResponse = await mongoClient.runQuery(Collections.GAMES, gameQueryObject);

            let gameDate = new Date(Date.parse(gameDateResponse["gameDate"]));
            gameDate.setHours(0, 0, 0, 0);

            if (currentDate >= gameDate) {
                res.status(400).json({errorMsg: "You cannot add a prediction post on or after they day of the game"});
                return;
            }
        }

        //Ensure that the blog post is being added for a game that the user has already predicted
        let predictionQueryObject = {
            gameId: req.body.gameId,
            username: req.body.username
        };

        let predictionResponse = await mongoClient.runSingleObjectQuery(Collections.PREDICTIONS, predictionQueryObject);

        if (predictionResponse !== null && predictionResponse !== undefined) {
            const blogPostToInsert = new BlogPost(req.body.blogPostTitle, req.body.blogPostData, 0, 
                req.body.username, req.body.gameId, req.body.blogPostType, new Date());
            await mongoClient.runInsert(Collections.BLOG_POSTS, blogPostToInsert);
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
            _id: ObjectId(req.params.gameId)
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
            _id: ObjectId(req.params.blogPostId)
        };

        let blogPostData = await mongoClient.runSingleObjectQuery(Collections.BLOG_POSTS, searchObject);

        //TODO: Convert to mongo query:  QueryRunner.runQuery(addViewSql);
        res.status(200).json(blogPostData);
    } catch (error) {
        console.log(error);
        res.status(500).json("Unable to retrieve blog post");
    }

    console.log("Exiting retrieveBlogPost/" + req.params.blogPostId);
});

app.get('/retrieveAllBlogPostHeaders', async (req, res) => {
    console.log("Entering /retrieveAllBlogPostHeaders");

    try {
        
        let sortObject = {
            editTime: -1
        };

        res.status(200).json(await mongoClient.runQueryWithSort(Collections.BLOG_POSTS, null, sortObject));
    } catch (error) {
        console.error(error);
        res.status(500).json("Unable to retrieve all blog post headers")
    }

    console.log("Exiting /retrieveAllBlogPostHeaders");
});

app.get("/userBlogLikeStatus/:postId/:username", async (req, res) => {
    console.log("Entering /userBlogLikeStatus/" + req.params.postId + "/" + req.params.username);

    try {
        let queryObj = {
            username: req.params.username,
            postId: req.params.postId
        };

        let result = await mongoClient.runSingleObjectQuery(Collections.BLOG_POST_LIKES, queryObj);

        let status = "UNLIKED";

        if (result !== null && result !== undefined) {
            status = "LIKED";
        }

        res.status(200).json({ userBlogLikeStatus: status});
    } catch (exception) {
        console.error("Unable to retrieve the blog like status for post: " + req.params.postId + " - " + req.params.username);
        res.status(500).json({ errorMsg: "Unable to retrieve the blog like status requested"});
    }

    console.log("Exiting /userBlogLikeStatus/" + req.params.postId + "/" + req.params.username);
});


app.post("/toggleBlogLikeStatus/:postId/:username", async (req, res) => {
    console.log("Entering /toggleBlogLikeStatus/" + req.params.postId + "/" + req.params.username);

    try {
        let queryObj = {
            username: req.params.username,
            postId: req.params.postId
        };

        let searchResult = await mongoClient.runSingleObjectQuery(Collections.BLOG_POST_LIKES, queryObj);

        if (searchResult === undefined || searchResult === null) {
            await mongoClient.runInsert(Collections.BLOG_POST_LIKES, queryObj);
        } else {
            await mongoClient.runDelete(Collections.BLOG_POST_LIKES, queryObj);
        }
        
        res.status(200).json("Succesfully toggled like status")

    } catch (exception) {
        console.error("Unable to toggle like status for post: " + req.params.postId + " - " + req.params.username);
        res.status(500).json({ errorMsg: "Unable to toggle like status for post: " + req.params.postId + " - " + req.params.username});
    }

    console.log("Exiting /toggleBlogLikeStatus/" + req.params.postId + "/" + req.params.username);
});
