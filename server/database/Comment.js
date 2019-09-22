module.exports = class Comment {
    constructor(username, postId, comment) {
        this.username = username;
        this.postId = postId;
        this.comment = comment;
        this.commentTimestamp = new Date();
    }
}