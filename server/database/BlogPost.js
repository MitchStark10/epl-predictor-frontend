module.exports = class BlogPost {
    constructor(postTitle, postData, viewCount, username, 
                gameId, blogPostType, editTime) {
        this.postTitle = postTitle;
        this.postData = postData;
        this.viewCount = viewCount;
        this.username = username;
        this.gameId = gameId;
        this.blogPostType = blogPostType;
        this.editTime = editTime;
    }

    //TODO: Getters, setters, modifiers
}