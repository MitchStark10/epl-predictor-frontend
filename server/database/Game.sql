CREATE TABLE GAME(
    GameId INT PRIMARY KEY AUTO_INCREMENT,
    HomeTeamName VARCHAR(50),
    AwayTeamName VARCHAR(50),
    HomeTeamScore INT,
    AwayTeamScore INT,
    GameDate DATETIME,
    Competition VARCHAR(30)
);