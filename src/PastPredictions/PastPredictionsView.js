import React, { Component } from 'react';
import $ from 'jquery';

class PastPredictionsView extends Component {

    constructor() {
        super();

        this.state = {
            pastGames: [],
            pastPredictions: [],
            predictedId: -1,
            errorMessage: "",
            needsPredictionRefresh: true,
            needsGameRefresh: true
        };
    }

    componentDidMount() {
        console.log("componeentDidMount");
        this.retrieveGames();
        this.retrievePredictions();
    }

    componentDidUpdate() {
        if (this.state.needsGameRefresh) {
            this.retrieveGames();
        }

        if (this.state.needsPredictionRefresh) {
            this.retrievePredictions();
        }
    }

    retrieveGames = () => {
        console.log("Retrieving Games from: " + process.env.REACT_APP_API_HOST + "/games/retrieveAllPastGames");
        fetch(process.env.REACT_APP_API_HOST + "/games/retrieveAllPastGames")
        .then( result => result.json() )
        .then(
            (previousGames) => {
                if (previousGames["errorMsg"]) {
                    this.setState({errorMessage: previousGames["errorMsg"], needsGameRefresh: false});
                } else {
                    this.setState({pastGames: previousGames, needsGameRefresh: false});
                }
            },
            (error) => {
                console.log("Error retrieving games: " + error);
            }
        );
    };

    retrievePredictions = () => {
        console.log("Retrieving Predictions from: " + process.env.REACT_APP_API_HOST + "/predictions/previousPredictions/" + this.props.userToken);
        fetch(process.env.REACT_APP_API_HOST + "/predictions/previousPredictions/" + this.props.userToken)
        .then ( result => result.json() )
        .then(
            (previousPredictions) => {
                console.log("Past predictions: " + JSON.stringify(previousPredictions));

                if (previousPredictions["errorMsg"]) {
                    this.setState({errorMessage: previousPredictions["errorMsg"], needsPredictionRefresh: false});
                } else {
                    this.setState({pastPredictions: previousPredictions, needsPredictionRefresh: false});
                }
            },
            (error) => {
                console.log("Error retrieving predictions: " + error);
                this.setState({needsPredictionRefresh: false});
            }
        );
    }

    renderPastGames = () => {
        let jsxList = [];

        console.log("Past games: " + JSON.stringify(this.state.pastGames));
        for (var i = 0; i < this.state.pastGames.length; i++) {
            let game = this.state.pastGames[i];

            let gameDate = new Date(game["GameDate"]);
            var day = gameDate.getDate();
            var monthIndex = gameDate.getMonth() + 1;
            var year = gameDate.getFullYear();

            jsxList.push(
                <div className="pastGame" key={game["GameId"]}>
                    <h3>{monthIndex}/{day}/{year}</h3>

                    <p id={game["GameId"]}>
                    {game["HomeTeamName"]} {game["HomeTeamScore"]} vs. {game["AwayTeamScore"]} {game["AwayTeamName"]} - {this.renderPrediction(game["GameId"])}
                    </p>
                </div>
            );
        }

        return jsxList;
    }

    renderPrediction = (gameId) => {
        for (var i = 0; i < this.state.pastPredictions.length; i++) {
            let prediction = this.state.pastPredictions[i];

            if (prediction["GameId"] === gameId) {
                return "Predicted Winner: " + prediction["WinningTeam"];
            }
        }

        return "Prediction Not Made";
    }

    render() {
        return (
            <div className="PastPredictionsView">
                <h1>Click on a team for each game to submit your predictions!</h1>
                {this.renderPastGames()}
            </div>
        );
    }
}

export default PastPredictionsView;