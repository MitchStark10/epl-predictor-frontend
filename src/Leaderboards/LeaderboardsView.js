import React, { Component } from 'react';
import './LeaderboardsView.css';

class LeaderboardsView extends Component {

    constructor(props) {
        super();

        this.state = {
            leaderboardStats: [],
            errorMessage: "",
            needsLeaderboardsRefresh: true
        };
    }

    componentDidMount() {
        this.retrieveLeaderboardStats();
    }

    componentDidUpdate() {
        if (this.state.needsLeaderboardsRefresh) {
            this.needsLeaderboardsRefresh();
        }
    }

    retrieveLeaderboardStats() {
        console.log("Retrieving Leaderboards from: " + process.env.REACT_APP_API_HOST + "/leaderboards/");
        fetch(process.env.REACT_APP_API_HOST + "/leaderboards/")
        .then( result => result.json() )
        .then(
            (leaderboardStats) => {
                if (leaderboardStats["errorMsg"]) {
                    this.setState({errorMessage: leaderboardStats["errorMsg"], needsLeaderboardsRefresh: false});
                } else {
                    this.setState({leaderboardStats: leaderboardStats, needsLeaderboardsRefresh: false});
                }
            },
            (error) => {
                console.log("Error retrieving games: " + error);
            }
        );
    }

    renderLeaderboardStats() {
        console.log(JSON.stringify(this.state.leaderboardStats));
        return (
            <div id="leaderboardStats">
                <table>
                    <tbody>
                        <tr>
                            <th>Username</th>
                            <th>Correct Prediction Rate</th>
                            <th>Total Prediction Count</th>
                            <th>Correct Prediction Count</th>
                            <th>Streak</th>
                        </tr>
                        {this.state.leaderboardStats.map((userStats, index) => {
                            return (<tr key={index}>
                                <td>{userStats["username"]}</td>
                                <td>{userStats["correctPredictionRate"]}</td>
                                <td>{userStats["totalPredictionCount"]}</td>
                                <td>{userStats["correctPredictionCount"]}</td>
                                <td>{userStats["streak"]}</td>
                            </tr>);
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        return (
            <div>
                <h1>Leaderboards</h1>
                {this.renderLeaderboardStats()}
            </div>
        );
    }
}

export default LeaderboardsView;