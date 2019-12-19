const app = module.exports = require('express')();
const Collections = require('../../database/Collections');
const MongoClientWrapper = require('../../service/MongoClientWrapper');
const mongoClient = new MongoClientWrapper();
const Comment = require('../../database/Comment');

//TODO: All of this needs to be fixed

app.get('/retrieveAllComments/:postId', async (req, res) => {
    console.log("Entering /retrieveAllComments/" + req.params.postId);

    try {
        const queryObj = {
            postId: req.params.postId
        };

        const orderByObj = {
            commentTimestamp: -1
        }

        const allCommentsFromPost = await mongoClient.runQueryWithSort(Collections.COMMENTS, queryObj, orderByObj);

        res.status(200).json(allCommentsFromPost);
    } catch (exception) {
        console.error("Caught unexpected exception during comments retrieval: " + exception);
        res.status(500).json({errorMsg: "Unable to retrieve comments. Please try again later."});
    }

    console.log("Exiting /retrieveAllComments/" + req.params.postId);
});

app.post('/addComment', async (req, res) => {
    console.log("Entering /addcomment");

    try {
        const commentToInsert = new Comment(req.body.username, req.body.postId, req.body.commentText);
        await mongoClient.runInsert(Collections.COMMENTS, commentToInsert);

        res.status(200).json("Succesfully added new comment");
    } catch (exception) {
        console.error("Caught unexpected exception during add comment: " + exception);
        res.status(500).json({errorMsg: "Unable to add new comment. Please try again later."});
    }

    console.log("Exiting /addcomment");
});

//TODO: Edit, delete comments