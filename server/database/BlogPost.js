class BlogPost {
    constructor(postId, postTitle, postData, viewCount, username, 
                gameId, blogPostType, editTime) {
        this.postId = postId;
        this.postTitle = postTitle;
        this.postData = postData;
        this.viewCount = viewCount;
        this.username = username;
        this.gameId = blogPostType;
        this.editTime = editTime;
    }

    //TODO: Getters, setters, modifiers
}

export default BlogPost;