module.exports = class Comment {
    constructor(username, gameId, comment) {
        this.username = username;
        this.gameId = gameId;
        this.comment = comment;
        this.commentTimestamp = new Date();
    }
}