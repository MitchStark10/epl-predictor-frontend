import React, { Component } from 'react';
import './PastPredictionsView.css';
import ImageRetrieverService from '../TeamImages/ImageRetrieverService';
import { withRouter } from 'react-router-dom';

class PastPredictionsView extends Component {

    constructor() {
        super();

        this.imageRetrieverService = new ImageRetrieverService();

        this.state = {
            pastGames: [],
            pastPredictions: [],
            predictedId: -1,
            errorMessage: '',
            needsPredictionRefresh: true,
            needsGameRefresh: true,
            redirectUrl: ''
        };
    }

    componentDidMount() {
        if (this.isUserLoggedIn()) {
            this.retrievePredictions();
            this.retrieveGames();
        } else {
            this.forwardToLoginPage();
        }
    }

    isUserLoggedIn() {
        return this.props.userToken && this.props.userToken !== '';
    }

    forwardToLoginPage() {
        this.props.history.push('/login');
    }

    componentDidUpdate() {
        if (this.state.redirectUrl !== '') {
            this.props.history.push(this.state.redirectUrl);
            this.setState({ needsGameRefresh: false, needsPredictionRefresh: false, redirectUrl: '' });
        } else {
            if (this.state.needsGameRefresh) {
                this.retrieveGames();
            }

            if (this.state.needsPredictionRefresh) {
                this.retrievePredictions();
            }
        }
    }

    determineColor = (homeScore, awayScore, homeTeam, awayTeam, prediction) => {
        if (prediction === null
                || homeScore === null
                || awayScore === null
                || homeScore === ''
                || awayScore === '') {

            return 'black';
        }

        let predictedWinner = prediction['WinningTeam'];
        let actualWinner;

        if (homeScore === awayScore) {
            actualWinner = 'Tie';
        } else if (homeScore > awayScore) {
            actualWinner = homeTeam;
        } else {
            actualWinner = awayTeam;
        }

        if (predictedWinner === actualWinner) {
            return 'green';
        }
        return 'red';

    }

    retrieveGames = () => {
        fetch('/public/api/games/retrieveAllPastGames')
            .then( result => result.json() )
            .then(
                (previousGames) => {
                    if (previousGames['errorMsg']) {
                        this.setState({errorMessage: previousGames['errorMsg'], needsGameRefresh: false});
                    } else {
                        this.setState({pastGames: previousGames, needsGameRefresh: false});
                    }
                },
                (error) => {
                    console.log('Error retrieving games: ' + error);
                }
            );
    };

    findPredictionByGameId = (gameId) => {
        for (var i = 0; i < this.state.pastPredictions.length; i++) {
            let prediction = this.state.pastPredictions[i];

            if (prediction['GameId'] === gameId) {
                return prediction;
            }
        }

        return null;
    }

    retrievePredictions = () => {
        fetch('/public/api/predictions/previousPredictions/' + this.props.userToken)
            .then( result => result.json() )
            .then(
                (previousPredictions) => {
                    if (previousPredictions['errorMsg']) {
                        this.setState({errorMessage: previousPredictions['errorMsg'], needsPredictionRefresh: false});
                    } else {
                        this.setState({pastPredictions: previousPredictions, needsPredictionRefresh: false});
                    }
                },
                (error) => {
                    console.log('Error retrieving predictions: ' + error);
                    this.setState({needsPredictionRefresh: false});
                }
            );
    }

    renderStats = () => {
        var correctPredictionCount = 0;
        var totalPredictionCount = 0;

        for (var i = 0; i < this.state.pastGames.length; i++) {
            let game = this.state.pastGames[i];
            let prediction = this.findPredictionByGameId(game['GameId']);

            let color = this.determineColor(game['HomeTeamScore'], game['AwayTeamScore'], game['HomeTeamName'], game['AwayTeamName'], prediction);

            if (color === 'green') {
                correctPredictionCount++;
                totalPredictionCount++;
            } else if (color === 'red') {
                totalPredictionCount++;
            }
        }

        var predictionSuccessRate;

        if (totalPredictionCount > 0) {
            predictionSuccessRate = (correctPredictionCount / totalPredictionCount * 100).toFixed(2);
        } else {
            predictionSuccessRate = '--';
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
            let prediction = this.findPredictionByGameId(game['GameId']);

            let gameDate = new Date(game['GameDate']);
            var day = gameDate.getDate();
            var monthIndex = gameDate.getMonth() + 1;
            var year = gameDate.getFullYear();


            let style = {
                'borderColor': this.determineColor(
                    game['HomeTeamScore'],
                    game['AwayTeamScore'],
                    game['HomeTeamName'],
                    game['AwayTeamName'],
                    prediction)
            };

            jsxList.push(
                <div className="PastGame" key={game['GameId']} style={style}>
                    <h2>{monthIndex}/{day}/{year} - {game['Competition']}</h2>
                    {this.renderPrediction(prediction)}
                    <p>{this.imageRetrieverService.renderTeamLogo(game['HomeTeamName'])} {game['HomeTeamName']}: {game['HomeTeamScore']}</p>
                    <p>{this.imageRetrieverService.renderTeamLogo(game['AwayTeamName'])} {game['AwayTeamName']}: {game['AwayTeamScore']}</p>

                    {/* <button className="PredictionsButton"
                        id={game["GameId"]}
                        onClick={this.handleBlogButtonClick}
                        value={"/posts/predictions/" + game["GameId"]}>
                            View Predictions
                    </button> */}

                    {/* <button className="AnalysisButton"
                        id={game["GameId"]}
                        onClick={this.handleBlogButtonClick}
                        value={"/posts/analysis/" + game["GameId"]}>
                            View Game Analysis
                    </button> */}
                </div>
            );
        }

        return jsxList;
    }

    renderPrediction = (prediction) => {
        if (prediction === null) {
            return <h3>Prediction Not Made</h3>;
        }

        return <h3>Predicted Winner: {prediction['WinningTeam']} {this.imageRetrieverService.renderTeamLogo(prediction['WinningTeam'])}</h3>;
    }

    handleBlogButtonClick = (event) => {
        this.setState({redirectUrl: event.target.value});
    }

    render() {
        if (this.state.redirectUrl !== '') {
            this.props.history.push(this.state.redirectUrl);
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

export default withRouter(PastPredictionsView);
