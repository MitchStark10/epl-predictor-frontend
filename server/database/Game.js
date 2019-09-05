module.exports = class Game {
    constructor(homeTeamName, awayTeamName, homeTeamScore, 
                awayTeamScore, gameDate, competition) {
        this.homeTeamName = homeTeamName;
        this.awayTeamName = awayTeamName;
        this.homeTeamScore = homeTeamScore;
        this.awayTeamScore = awayTeamScore;
        this.gameDate = gameDate;
        this.competition = competition;
    }
}