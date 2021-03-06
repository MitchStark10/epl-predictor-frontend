CREATE TABLE BLOG_POST_LIKE(
    PostId INT,
    Username VARCHAR(30),
    PRIMARY KEY (PostId, Username),
    FOREIGN KEY (PostId) REFERENCES BLOG_POST(PostId),
    FOREIGN KEY (Username) REFERENCES USER(Username)
);