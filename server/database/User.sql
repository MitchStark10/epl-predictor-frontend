CREATE TABLE USER (
    Username VARCHAR(30) PRIMARY KEY,
    Password VARCHAR(150),
    eMail VARCHAR(30),
    Status VARCHAR(30),
    SessionCookie VARCHAR(150),
    IsGoogleUser TINYINT
);
