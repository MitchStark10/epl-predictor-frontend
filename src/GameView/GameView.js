import React, { Component } from 'react';

class GameView extends Component {

    constructor() {
        super();

        this.state = {
            games: []
        };
    }

    componentDidMount() {
        console.log("componeentDidMount");
        this.retrieveGames();
    }

    componentDidUpdate() {
        console.log("componentDidUpdate");

        if (this.state.games === []) {
            this.retrieveGames();
        }
    }

    retrieveGames = () => {
        console.log("Retrieving Games from: " + JSON.stringify(process.env.REACT_APP_API_HOST) + "/retrievAllGames");
        fetch(process.env.REACT_APP_API_HOST + "/retrieveAllGames")
        .then(result=>result.json())
        .then(
            (games) => {
                this.setState({games: games})
            },
            (error) => {
                console.log("Error retrieving games: " + error);
            });
    }

    renderGames() {
        let gameHtmlList = [];
        console.log("Enter renderGames");
        for (var i = 0; i < this.state.games.length; i++) {
            let game = this.state.games[i];

            let actualGoalDifference = game["HomeTeamScore"] - game["AwayTeamScore"];
            let predictedGoalDifference = game["PredictedHomeTeamScore"] - game["PredictedAwayTeamScore"];

            console.log(actualGoalDifference +  " : " + predictedGoalDifference);

            let backgroundColor;

            if (actualGoalDifference === predictedGoalDifference) {
                backgroundColor = "green";
            } else if ((actualGoalDifference > 0 && predictedGoalDifference > 0) || (actualGoalDifference < 0 && predictedGoalDifference < 0)) {
                backgroundColor = "lightblue";
            } else {
                backgroundColor = "red";
            }

            let backgroundStyle = {backgroundColor: backgroundColor};

            gameHtmlList.push((
                <div className="gameInfo" key={i}>
                    <p style={backgroundStyle}>{game["GameDate"]}: {game["HomeTeam"]} {game["HomeTeamScore"]} ({game["PredictedHomeTeamScore"]}) - {game["AwayTeamScore"]} ({game["PredictedAwayTeamScore"]}) {game["AwayTeam"]}</p>
                </div>
            ));
        }

        return gameHtmlList;
    }

    render() {
        return (
            <div className="GameView">
                <p>Game View - Under Construction</p>
                {this.renderGames()}
            </div>
        );
    }
}

export default GameView;