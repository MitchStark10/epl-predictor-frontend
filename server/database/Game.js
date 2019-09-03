class Game {
    constructor(gameId, homeTeamName, awayTeamName, homeTeamScore, 
                awayTeamScore, gameDate, competition) {
        this.gameId = gameId;
        this.homeTeamName = homeTeamName;
        this.awayTeamName = awayTeamName;
        this.homeTeamScore = homeTeamScore;
        this.awayTeamScore = awayTeamScore;
        this.gameDate = gameDate;
        this.competition = competition;
    }
}

export default Game;