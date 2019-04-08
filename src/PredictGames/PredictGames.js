import React, { Component } from 'react';

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

    handleButtonClick = (event) => {
        console.log("Clicked Main Menu Button: " + event.target.id);
        this.props.changeToView(event.target.id);
    }

    renderUpcomingGames = () => {
        let jsxList = [];

        for (var i = 0; i < this.state.upcomingGames.length; i++) {
            let game = this.state.upcomingGames[i];
            jsxList.push(
                <div className="upcomingGame">
                    <p>{game["HomeTeamName"]} vs. {game["AwayTeamName"]} - {game["GameDate"]}</p>
                </div>
            );
        }

        return jsxList;
    }

    render() {
        return (
            <div className="PredictGamesView">
                <h1>Testing Predict Games View</h1>
                {this.renderUpcomingGames()}
            </div>
        );
    }
}

export default PredictGamesView;