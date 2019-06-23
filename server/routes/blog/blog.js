const app = module.exports = require('express')();
const QueryRunner = require('../../service/QueryRunner').buildQueryRunner();
const mysql = require('mysql');

const INSERT_NEW_BLOG_POST_SQL = `
INSERT INTO BLOG_POST(PostTitle, PostData, ViewCount, Username)
VALUES (?, ?, 0, ?)
`;

const RETRIEVE_BLOG_POST_HEADERS_SQL = `
SELECT PostId, PostTitle, Username
FROM BLOG_POST
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

const EDIT_BLOG_POST_SQL = `
UPDATE BLOG_POST
SET PostTitle = ?,
    PostData = ?
WHERE PostId = ?
`;

const DELETE_BLOG_POST_SQL = `
DELETE FROM BLOG_POST WHERE PostId = ?
`;

app.post('/addNewBlogPost', async (req, res) => {
    console.log("Entered add new blog post");

    try {
        let params = [req.body.blogPostTitle, req.body.blogPostData, req.body.username];
        let insertBlogPostSql = mysql.format(INSERT_NEW_BLOG_POST_SQL, params);
        await QueryRunner.runQuery(insertBlogPostSql);
        res.status(200).json("Successfully added new blog post")
    } catch (error) {
        console.log(error)
        res.status(500).json("Unable to insert new blog post");
    }

    console.log("Exiting add new blog post");
});

app.post('/updateBlogPost', async (req, res) => {
    console.log("Entering updateBlogPost");

    try {
        let params = [req.body.blogPostTitle, req.body.blogPostData, req.body.blogPostId];
        let editGameSql = mysql.format(EDIT_BLOG_POST_SQL, params);
        await QueryRunner.runQuery(editGameSql);
        res.status(200).json("Successfully saved blog post edits");
    } catch (error) {
        console.log(error);
        res.status(500).json("Unable to edit blog post");
    }

    
    console.log("Exiting updateBlogPost");
});

app.get('/retrieveAllBlogPostHeaders', async (req, res) => {
    console.log("Entering retrieveAllBlogPostHeaders");

    try {
        let blogResults = await QueryRunner.runQuery(RETRIEVE_BLOG_POST_HEADERS_SQL);
        res.status(200).json(blogResults);
    } catch (error) {
        console.log(error);
        res.status(500).json("Unable to retrieve blog post headers");
    }

    console.log("Exiting retrieveAllBlogPostHeaders");
});

app.get('/retrieveBlogPost/:blogPostId', async (req, res) => {
    console.log("Entering retrieveBlogPost/" + req.params.blogPostId);

    try {
        let params = [req.params.blogPostId];
        let retrieveBlogQuery = mysql.format(RETRIEVE_BLOG_POST_SQL, params);
        let blogPostData = await QueryRunner.runQuery(retrieveBlogQuery);
        res.status(200).json(blogPostData);
    } catch (error) {
        console.log(error);
        res.status(500).json("Unable to retrieve blog post");
    }

    console.log("Exiting retrieveBlogPost/" + req.params.blogPostId);
});

app.delete('/deleteBlogPost/:blogPostId', async (req, res) => {
    console.log("Entering deleteBlogPost/" + req.params.blogPostId);

    try {
        let params = [req.params.blogPostId];
        let deleteSql = mysql.format(DELETE_BLOG_POST_SQL, params);
        await QueryRunner.runQuery(deleteSql);
        res.status(200).json("Deleted blog post");
    } catch (error) {
        console.log(error);
        res.status(500).json("Unable to delete blog post");
    }

    console.log("Exiting deleteBlogPost/" + req.params.blogPostId);
});