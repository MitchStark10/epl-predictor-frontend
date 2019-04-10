import React, { Component } from 'react';
import $ from 'jquery';

class PredictGamesView extends Component {

    constructor() {
        super();

        this.state = {
            upcomingGames: [],
            errorMessage: ""
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
        console.log("Retrieving Games from: " + process.env.REACT_APP_API_HOST + "/games/retrievAllUpcomingGames");
        fetch(process.env.REACT_APP_API_HOST + "/games/retrieveAllUpcomingGames")
        .then( result => result.json() )
        .then(
            (upcomingGames) => {
                console.log("Upcoming games: " + JSON.stringify(upcomingGames));

                if (upcomingGames["errorMsg"]) {
                    this.setState({errorMessage: upcomingGames["errorMsg"]});
                } else {
                    this.setState({upcomingGames: upcomingGames});
                }
            },
            (error) => {
                console.log("Error retrieving games: " + error);
            }
        );
    };

    handleMenuButtonClick = (event) => {
        console.log("Clicked Main Menu Button: " + event.target.id);
        this.props.changeToView(event.target.id);
    }

    handlePredictionButtonClick = (event) => {
        console.log("Clicked Prediction Button: " + event.target.id + " - " + event.target.value);
        let endpoint = "/predictions/addOrUpdatePrediction";
        let url = process.env.REACT_APP_API_HOST + endpoint;

        let postData = {
            username: this.props.userToken,
            gameId: event.target.id,
            winningTeam: event.target.value
        }

        $.post(url, postData)
        .done((response) => {
            console.log(response);
        })
        .fail((error) => {
            this.setState({statusMessage: "Unable to predict game: " + error.responseText});
        });
    }

    renderUpcomingGames = () => {
        let jsxList = [];

        for (var i = 0; i < this.state.upcomingGames.length; i++) {
            let game = this.state.upcomingGames[i];

            let gameDate = new Date(game["GameDate"]);
            var day = gameDate.getDate();
            var monthIndex = gameDate.getMonth();
            var year = gameDate.getFullYear();

            jsxList.push(
                <div className="upcomingGame" key={game["GameId"]}>
                    <h3>{monthIndex}/{day}/{year}</h3>

                    <button 
                    id={game["GameId"]}
                    onClick={this.handlePredictionButtonClick}
                    value={game["HomeTeamName"]}>
                        {game["HomeTeamName"]}
                    </button>

                    <button 
                    id={game["GameId"]} 
                    onClick={this.handlePredictionButtonClick}
                    value="Tie">
                            Tie
                    </button>

                    <button 
                    id={game["GameId"]} 
                    onClick={this.handlePredictionButtonClick}
                    value={game["AwayTeamName"]}>
                        {game["AwayTeamName"]}
                    </button>
                </div>
            );
        }

        return jsxList;
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