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
            predictedId: -1,
            errorMessage: "",
            needsGameRefresh: true,
            redirectUrl: ""
        };
    }

    componentDidMount() {
        if (this.isUserLoggedIn()) {
            this.retrieveGames();
        } else {
            this.forwardToLoginPage();
        }
    }

    componentDidUpdate() {
        if (this.state.redirectUrl !== "") {
            this.setState({redirectUrl: "", needsGameRefresh: false});
        } else if (this.state.needsGameRefresh) {
            this.retrieveGames();
        }
    }

    isUserLoggedIn() {
        return this.props.userToken && this.props.userToken !== "";
    }

    forwardToLoginPage() {
        this.props.history.push('/login');
    }

    retrieveGames = () => {
        fetch("/public/api/games/retrieveAllUpcomingGamesWithPredictions/" + this.props.userToken)
            .then(result => result.json())
            .then(
                (upcomingGames) => {
                    if (upcomingGames["errorMsg"]) {
                        this.setState({ errorMessage: upcomingGames["errorMsg"], needsGameRefresh: false });
                    } else {
                        this.setState({ upcomingGames: upcomingGames, needsGameRefresh: false, redirectUrl: "" });
                    }
                },
                (error) => {
                    console.log("Error retrieving games: " + error);
                }
            );
    };

    handlePredictionButtonClick = (event) => {
        let url = "/public/api/predictions/addOrUpdatePrediction";

        let postData = {
            username: this.props.userToken,
            gameId: event.target.id,
            winningTeam: event.target.value
        }

        $.post(url, postData)
            .done((response) => {
                this.setState({ needsGameRefresh: true });
            })
            .fail((error) => {
                this.setState({ errorMessage: "Unable to predict game: " + error.responseText });
            });
    }

    handleBlogButtonClick = (event) => {
        this.setState({ redirectUrl: event.target.value });
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
                    {this.renderPrediction(game)}

                    {/* <button className="PredictionsButton"
                        id={game["GameId"]}
                        onClick={this.handleBlogButtonClick}
                        value={"/posts/predictions/" + game["GameId"]}>
                        View Predictions
                    </button> */}
                </div>
            );
        }

        return jsxList;
    }

    renderPrediction = (game) => {
        if (game["PredictedWinningTeam"]) {
            return (
                <h3>Predicted Winner: {this.teamNameUtility.mapTeamNames(game["PredictedWinningTeam"])} {this.imageRetrieverService.renderTeamLogo(game["PredictedWinningTeam"])}</h3>
            );
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

export default withRouter(PredictGamesView);