import React, { Component } from 'react';
import $ from 'jquery';
import './PredictGames.css';

class PredictGamesView extends Component {

    constructor() {
        super();

        this.state = {
            upcomingGames: [],
            upcomingPredictions: [],
            predictedId: -1,
            errorMessage: "",
            needsPredictionRefresh: true,
            needsGameRefresh: true
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

    retrieveGames = () => {
        fetch(process.env.REACT_APP_API_HOST + "/games/retrieveAllUpcomingGames")
        .then( result => result.json() )
        .then(
            (upcomingGames) => {
                if (upcomingGames["errorMsg"]) {
                    this.setState({errorMessage: upcomingGames["errorMsg"], needsGameRefresh: false});
                } else {
                    this.setState({upcomingGames: upcomingGames, needsGameRefresh: false});
                }
            },
            (error) => {
                console.log("Error retrieving games: " + error);
            }
        );
    };

    retrievePredictions = () => {
        fetch(process.env.REACT_APP_API_HOST + "/predictions/upcomingPredictions/" + this.props.userToken)
        .then ( result => result.json() )
        .then(
            (upcomingPredictions) => {
                if (upcomingPredictions["errorMsg"]) {
                    this.setState({errorMessage: upcomingPredictions["errorMsg"], needsPredictionRefresh: false});
                } else {
                    this.setState({
                        upcomingPredictions: upcomingPredictions, 
                        needsPredictionRefresh: false}
                    );
                }
            },
            (error) => {
                console.log("Error retrieving predictions: " + error);
                this.setState({needsPredictionRefresh: false});
            }
        );
    }

    handlePredictionButtonClick = (event) => {
        let endpoint = "/predictions/addOrUpdatePrediction";
        let url = process.env.REACT_APP_API_HOST + endpoint;

        let postData = {
            username: this.props.userToken,
            gameId: event.target.id,
            winningTeam: event.target.value
        }

        $.post(url, postData)
        .done((response) => {
            this.setState({needsPredictionRefresh: true});
        })
        .fail((error) => {
            this.setState({errorMessage: "Unable to predict game: " + error.responseText});
        });
    }

    renderUpcomingGames = () => {
        let jsxList = [];

        for (var i = 0; i < this.state.upcomingGames.length; i++) {
            let game = this.state.upcomingGames[i];

            let gameDate = new Date(game["GameDate"]);
            var day = gameDate.getDate();
            var monthIndex = gameDate.getMonth() + 1;
            var year = gameDate.getFullYear();

            jsxList.push(
                <div className="UpcomingGame" key={game["GameId"]}>
                    <h3>{monthIndex}/{day}/{year} - {game["Competition"]}</h3>

                    <button className="SM-Button"
                    id={game["GameId"]}
                    onClick={this.handlePredictionButtonClick}
                    value={game["HomeTeamName"]}>
                        {game["HomeTeamName"]}
                    </button>

                    <button className="SM-Button"
                    id={game["GameId"]} 
                    onClick={this.handlePredictionButtonClick}
                    value="Tie">
                            Tie
                    </button>

                    <button className="SM-Button"
                    id={game["GameId"]} 
                    onClick={this.handlePredictionButtonClick}
                    value={game["AwayTeamName"]}>
                        {game["AwayTeamName"]}
                    </button>
                    <br />
                    {this.renderPrediction(game["GameId"])}
                </div>
            );
        }

        return jsxList;
    }

    renderPrediction = (gameId) => {
        for (var i = 0; i < this.state.upcomingPredictions.length; i++) {
            let prediction = this.state.upcomingPredictions[i];

            if (prediction["GameId"] === gameId) {
                return (
                    <h3>Predicted Winner: {prediction["WinningTeam"]}</h3>
                );
            }
        }

        return (
            <h3>Predicted Winner: (Not Yet Predicted)</h3>
        );
    }

    render() {
        return (
            <div className="PredictGamesView">
                <h1>Click on a team for each game to submit your predictions!</h1>
                {this.renderUpcomingGames()}
            </div>
        );
    }
}

export default PredictGamesView;