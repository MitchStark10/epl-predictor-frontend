import React, { Component } from 'react';
import './PastPredictionsView.css';
import { Redirect } from 'react-router-dom';

class PastPredictionsView extends Component {

    constructor() {
        super();

        this.state = {
            pastGames: [],
            pastPredictions: [],
            predictedId: -1,
            errorMessage: "",
            needsPredictionRefresh: true,
            needsGameRefresh: true,
            redirectUrl: ""
        };
    }

    componentDidMount() {
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

    determineColor = (homeScore, awayScore, homeTeam, awayTeam, prediction) => {
        if (prediction === null 
                || homeScore === null
                || awayScore === null
                || homeScore === ""
                || awayScore === "") {
                    
            return "black";
        }

        let predictedWinner = prediction["WinningTeam"];
        let actualWinner;

        if (homeScore === awayScore) {
            actualWinner = "Tie";
        } else if (homeScore > awayScore) {
            actualWinner = homeTeam;
        } else {
            actualWinner = awayTeam;
        }

        if (predictedWinner === actualWinner) {
            return "green";
        } else {
            return "red";
        }
    }

    retrieveGames = () => {
        fetch("/api/games/retrieveAllPastGames")
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

    findPredictionByGameId = (gameId) => {
        for (var i = 0; i < this.state.pastPredictions.length; i++) {
            let prediction = this.state.pastPredictions[i];

            if (prediction["GameId"] === gameId) {
                return prediction;
            }
        }

        return null;
    }

    retrievePredictions = () => {
        fetch("/api/predictions/previousPredictions/" + this.props.userToken)
        .then ( result => result.json() )
        .then(
            (previousPredictions) => {
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

    renderStats = () => {
        var correctPredictionCount = 0;
        var totalPredictionCount = 0;

        for (var i = 0; i < this.state.pastGames.length; i++) {
            let game = this.state.pastGames[i];
            let prediction = this.findPredictionByGameId(game["GameId"]);

            let color = this.determineColor(game["HomeTeamScore"], game["AwayTeamScore"], game["HomeTeamName"], game["wwayTeamName"], prediction);

            if (color === "green") {
                correctPredictionCount++;
                totalPredictionCount++;
            } else if (color === "red") {
                totalPredictionCount++;
            }
        }

        var predictionSuccessRate;
        
        if (totalPredictionCount > 0) {
            predictionSuccessRate = (correctPredictionCount / totalPredictionCount * 100).toFixed(2);
        } else {
            predictionSuccessRate = "--";
        }

        return (
            <div className="statBox">
                <h2>Prediction Success Rate: {predictionSuccessRate}%</h2>
                <h3>Total Predictions: {totalPredictionCount}</h3>
                <h3>Correct Predictions: {correctPredictionCount}</h3>
            </div>
        );
    }

    renderPastGames = () => {
        let jsxList = [];

        for (var i = 0; i < this.state.pastGames.length; i++) {
            let game = this.state.pastGames[i];
            let prediction = this.findPredictionByGameId(game["GameId"]);

            let gameDate = new Date(game["GameDate"]);
            var day = gameDate.getDate();
            var monthIndex = gameDate.getMonth() + 1;
            var year = gameDate.getFullYear();


            let style = {
                "borderColor": this.determineColor(
                        game["HomeTeamScore"], 
                        game["AwayTeamScore"], 
                        game["HomeTeamName"],
                        game["AwayTeamName"],
                        prediction)
            }

            jsxList.push(
                <div className="PastGame" key={game["GameId"]} style={style}>
                    <h2>{monthIndex}/{day}/{year} - {game["Competition"]}</h2>
                    <h3>{this.renderPrediction(prediction)}</h3>
                    <p>{game["HomeTeamName"]}: {game["HomeTeamScore"]}</p>
                    <p>{game["AwayTeamName"]}: {game["AwayTeamScore"]}</p>

                    <button className="PredictionsButton"
                        id={game["GameId"]}
                        onClick={this.handleBlogButtonClick}
                        value={"/posts/predictions/" + game["GameId"]}>
                            View Predictions
                    </button>

                    <button className="AnalysisButton"
                        id={game["GameId"]}
                        onClick={this.handleBlogButtonClick}
                        value={"/posts/analysis/" + game["GameId"]}>
                            View Game Analysis
                    </button>
                </div>
            );
        }

        return jsxList;
    }

    renderPrediction = (prediction) => {
        if (prediction === null) {
            return "Prediction Not Made";
        }

        return "Predicted Winner: " + prediction["WinningTeam"];
    }

    handleBlogButtonClick = (event) => {
        this.setState({redirectUrl: event.target.value});
    }

    render() {
        if (this.state.redirectUrl !== "") {
            return <Redirect to={this.state.redirectUrl} />
        }

        return (
            <div className="PastPredictionsView">
                <h1>View Your Past Predictions!</h1>
                {this.renderStats()}
                {this.renderPastGames()}
            </div>
        );
    }
}

export default PastPredictionsView;