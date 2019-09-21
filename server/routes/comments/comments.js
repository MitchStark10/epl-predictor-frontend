const app = module.exports = require('express')();
const Collections = require('../../database/Collections');
const MongoClientWrapper = require('../../service/MongoClientWrapper');
const mongoClient = new MongoClientWrapper();
const Comment = require('../../database/Comment');

app.get('/retrieveAllComments/:gameId', async (req, res) => {
    console.log("Entering /retrieveAllComments/" + req.params.gameId);

    try {
        const queryObj = {
            gameId: req.params.gameId
        };

        const orderByObj = {
            commentTimestamp: -1
        }

        const allCommentsFromGame = await mongoClient.runQueryWithSort(Collections.COMMENTS, queryObj, orderByObj);

        res.status(200).json(allCommentsFromGame);
    } catch (exception) {
        console.error("Caught unexpected exception during comments retrieval: " + exception);
        res.status(500).json({errorMsg: "Unable to retrieve comments. Please try again later."});
    }

    console.log("Exiting /retrieveAllComments/" + req.params.gameId);
});

app.post('/addComment', async (req, res) => {
    console.log("Entering /addcomment");

    try {
        const commentToInsert = new Comment(req.body.username, req.body.gameId, req.body.commentText);
        await mongoClient.runInsert(Collections.COMMENTS, commentToInsert);

        res.status(200).json("Succesfully added new comment");
    } catch (exception) {
        console.error("Caught unexpected exception during add comment: " + exception);
        res.status(500).json({errorMsg: "Unable to add new comment. Please try again later."});
    }

    console.log("Exiting /addcomment");
});

//TODO: Edit, delete comments