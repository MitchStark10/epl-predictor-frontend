module.exports = class Prediction {
    constructor(username, gameId, winningTeam) {
        this.username = username;
        this.gameId = gameId;
        this.winningTeam = winningTeam;
    }
}