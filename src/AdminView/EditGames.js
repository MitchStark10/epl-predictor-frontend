import React, { Component } from 'react';
import EditGame from './EditGame';

class EditGames extends Component {

    constructor() {
        super();

        this.state = {
            games: [],
            errorMessage: "",
            needsGameRefresh: true
        };
    }

    componentDidMount() {
        this.retrieveGames();
    }

    componentDidUpdate() {
        if (this.state.needsGameRefresh) {
            this.retrieveGames();
        }
    }

    retrieveGames = () => {
        fetch(process.env.REACT_APP_API_HOST + "/games/retrieveAllGames")
        .then( result => result.json() )
        .then(
            (previousGames) => {
                if (previousGames["errorMsg"]) {
                    this.setState({errorMessage: previousGames["errorMsg"], needsGameRefresh: false});
                } else {
                    this.setState({games: previousGames, needsGameRefresh: false});
                }
            },
            (error) => {
                console.log("Error retrieving games: " + error);
            }
        );
    };

    renderGames = () => {
        let jsxList = [];

        for (var i = 0; i < this.state.games.length; i++) {
            let game = this.state.games[i];

            jsxList.push(
                <div class="EditGameContainer">
                    <EditGame game={game} />
                    <br />
                </div>
            );
        }

        return jsxList;
    }

    render() {
        return (
            <div className="EditGames">
                <p id="statusMessage">{this.state.statusMessage}</p>
                {this.renderGames()}
            </div>
        );
    }
}

export default EditGames;