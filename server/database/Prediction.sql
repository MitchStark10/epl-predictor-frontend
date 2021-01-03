CREATE TABLE PREDICTION(
    Username VARCHAR(30),
    GameId INT,
    WinningTeam VARCHAR(50),
    FOREIGN KEY (Username) REFERENCES USER(Username) ON UPDATE CASCADE,
    FOREIGN KEY (GameId) REFERENCES GAME(GameId),
    PRIMARY KEY (Username, GameId)
);
