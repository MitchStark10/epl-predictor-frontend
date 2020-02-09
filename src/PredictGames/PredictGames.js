import React, { Component } from 'react';
import $ from 'jquery';
import './PredictGames.css';
import { withRouter } from 'react-router-dom';
import ImageRetrieverService from '../TeamImages/ImageRetrieverService';
import TeamNameUtility from '../Utility/TeamNameUtility';

class PredictGamesView extends Component {

    constructor() {
        super();

        this.imageRetrieverService = new ImageRetrieverService();
        this.teamNameUtility = new TeamNameUtility();

        this.state = {
            upcomingGames: [],
            upcomingPredictions: [],
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

    retrieveGames = () => {
        fetch("/public/api/games/retrieveAllUpcomingGames")
        .then( result => result.json() )
        .then(
            (upcomingGames) => {
                if (upcomingGames["errorMsg"]) {
                    this.setState({errorMessage: upcomingGames["errorMsg"], needsGameRefresh: false});
                } else {
                    this.setState({upcomingGames: upcomingGames, needsGameRefresh: false, redirectUrl: ""});
                }
            },
            (error) => {
                console.log("Error retrieving games: " + error);
            }
        );
    };

    retrievePredictions = () => {
        console.log("fetching : " + this.props.userToken);
        fetch("/public/api/predictions/upcomingPredictions/" + this.props.userToken)
        .then ( result => result.json() )
        .then(
            (upcomingPredictions) => {
                if (upcomingPredictions["errorMsg"]) {
                    this.setState({errorMessage: upcomingPredictions["errorMsg"], needsPredictionRefresh: false});
                } else {
                    this.setState({
                        upcomingPredictions: upcomingPredictions, 
                        needsPredictionRefresh: false,
                        redirectUrl: ""}
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
        let url = "/public/api/predictions/addOrUpdatePrediction";

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

    handleBlogButtonClick = (event) => {
        this.setState({redirectUrl: event.target.value});
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

                    <button className="SmButton"
                    id={game["GameId"]}
                    onClick={this.handlePredictionButtonClick}
                    value={game["HomeTeamName"]}>
                        {this.teamNameUtility.mapTeamNames(game["HomeTeamName"])} {this.imageRetrieverService.renderTeamLogo(game["HomeTeamName"])}
                    </button>

                    <button className="SmButton"
                    id={game["GameId"]} 
                    onClick={this.handlePredictionButtonClick}
                    value="Tie">
                            Tie
                    </button>

                    <button className="SmButton"
                    id={game["GameId"]} 
                    onClick={this.handlePredictionButtonClick}
                    value={game["AwayTeamName"]}>
                        {this.teamNameUtility.mapTeamNames(game["AwayTeamName"])} {this.imageRetrieverService.renderTeamLogo(game["AwayTeamName"])}
                    </button>
                    <br />
                    {this.renderPrediction(game["GameId"])}

                    <button className="PredictionsButton"
                    id={game["GameId"]}
                    onClick={this.handleBlogButtonClick}
                    value={"/posts/predictions/" + game["GameId"]}>
                        View Predictions
                    </button>
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
                    <h3>Predicted Winner: {this.teamNameUtility.mapTeamNames(prediction["WinningTeam"])} {this.imageRetrieverService.renderTeamLogo(prediction["WinningTeam"])}</h3>
                );
            }
        }

        return (
            <h3>Predicted Winner: (Not Yet Predicted)</h3>
        );
    }

    render() {
        if (this.state.redirectUrl !== "") {
            this.props.history.push(this.state.redirectUrl);
            return null;
        }

        return (
            <div className="PredictGamesView">
                <h1>Click on a team for each game to submit your predictions!</h1>
                {this.renderUpcomingGames()}
            </div>
        );
    }
}

export default withRouter(PredictGamesView);