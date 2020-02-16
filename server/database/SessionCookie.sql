CREATE TABLE SESSION_COOKIE (
    Username VARCHAR(30),
    SessionCookie VARCHAR(150),
    Device VARCHAR(30),
    PRIMARY KEY (Username, Device),
    FOREIGN KEY (Username) REFERENCES USER(Username)
);