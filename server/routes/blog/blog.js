const app = module.exports = require('express')();
const QueryRunner = require('../../service/QueryRunner').buildQueryRunner();
const mysql = require('mysql');

const INSERT_NEW_BLOG_POST_SQL = `
INSERT INTO BLOG_POST(PostTitle, PostData, ViewCount, Username)
VALUES (?, ?, 0, ?)
`;

app.post('/addNewBlogPost', async (req, res) => {
    console.log("Entered add new blog post");

    try {
        let params = [req.body.blogPostTitle, req.body.blogPostData, req.body.username];
        let insertBlogPostSql = mysql.format(INSERT_NEW_BLOG_POST_SQL, params);
        await QueryRunner.runQuery(insertBlogPostSql);
    } catch (error) {
        console.log(error)
        res.status(500).json("Unable to insert new blog post");
        return;
    }

    res.status(200).json("Successfully added new blog post")

    console.log("Exiting add new blog post");
});