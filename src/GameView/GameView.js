import React, { Component } from 'react';

class GameView extends Component {

    constructor() {
        super();

        this.state = {
            games: [],
            predictionSuccessRate: {}
        };
    }

    isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
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

        if (this.isEmpty(this.state.predictionSuccessRate)) {
            this.retrievePredictionSuccessRate();
        }
    }

    retrieveGames = () => {
        console.log("Retrieving Games from: " + JSON.stringify(process.env.REACT_APP_API_HOST) + "/retrievAllGames");
        fetch(process.env.REACT_APP_API_HOST + "/retrieveAllGames")
        .then(result => result.json())
        .then(
            (games) => {
                this.setState({games: games});
            },
            (error) => {
                console.log("Error retrieving games: " + error);
            }
        );
    }
    
    retrievePredictionSuccessRate = () => {
        console.log("Retrieving prediction success rates: " + JSON.stringify(process.env.REACT_APP_API_HOST) + "/retrievePredictionSuccessRate");
        fetch(process.env.REACT_APP_API_HOST + "/retrievePredictionSuccessRate")
        .then(result => result.json())
        .then(
            (successRate) => {
                this.setState({predictionSuccessRate: successRate});
            },
            (error) => {
                console.error("Error retrieving prediction rates: " + error);
            }
        )
    }

    renderPredictionRate = () => {
        return (
            <div>
                <h3>v1.0.0 Prediction Correct Goal Differential Success Rate: {this.state.predictionSuccessRate["SUCCESS_RATE"]}%</h3>
                <h3>v1.0.0 Correct Game Outcome Prediction Success Rate: {this.state.predictionSuccessRate["CORRECT_GAME_OUTCOME_RATE"]}%</h3>
            </div>
        );
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
                {this.renderPredictionRate()}
                {this.renderGames()}
            </div>
        );
    }
}

export default GameView;