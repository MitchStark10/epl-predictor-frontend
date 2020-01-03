const app = module.exports = require('express')();
const mysql = require('mysql');
const QueryRunner = require('../../service/QueryRunner').buildQueryRunner();

const RETRIEVE_ALL_COMMENTS_SQL = `
SELECT *
FROM COMMENT
WHERE PostId = ?
`;

const INSERT_NEW_COMMENT_SQL = `
INSERT INTO COMMENT(Username, PostId, CommentText, CommentTime)
VALUES (?, ?, ?, NOW())
`;

app.get('/retrieveAllComments/:postId', async (req, res) => {
    console.log("Entering /retrieveAllComments/" + req.params.postId);

    try {
        const params = [req.params.postId];
        const query = mysql.format(RETRIEVE_ALL_COMMENTS_SQL, params);
        const response = await QueryRunner.runQuery(query);
        res.status(200).json(response);
    } catch (exception) {
        console.error("Caught unexpected exception during comments retrieval: " + exception);
        res.status(500).json({errorMsg: "Unable to retrieve comments. Please try again later."});
    }

    console.log("Exiting /retrieveAllComments/" + req.params.postId);
});

app.post('/addComment', async (req, res) => {
    console.log("Entering /addcomment");

    try {
        const params = [req.body.username, req.body.postId, req.body.commentText];
        const insertQuery = mysql.format(INSERT_NEW_COMMENT_SQL, params);
        await QueryRunner.runQuery(insertQuery);
        res.status(200).json("Succesfully added new comment");
    } catch (exception) {
        console.error("Caught unexpected exception during add comment: " + exception);
        res.status(500).json({errorMsg: "Unable to add new comment. Please try again later."});
    }

    console.log("Exiting /addcomment");
});
