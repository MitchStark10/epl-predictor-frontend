CREATE TABLE BLOG_POST(
    PostId INT PRIMARY KEY AUTO_INCREMENT,
    PostTitle VARCHAR(50) NOT NULL,
    PostData BLOB NOT NULL,
    ViewCount INT,
    Username VARCHAR(30) NOT NULL,
    GameId INT NOT NULL,
    BlogPostType VARCHAR(20) NOT NULL,
    EditTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Username) REFERENCES USER(Username),
    FOREIGN KEY (GameId) REFERENCES GAME(GameId)
); 