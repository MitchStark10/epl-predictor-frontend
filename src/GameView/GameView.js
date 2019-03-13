import React, { Component } from 'react';

class GameView extends Component {

    constructor() {
        super();

        this.state = {
            games: []
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
        console.log("Retrieving Games from: " + JSON.stringify(process.env.REACT_APP_API_HOST) + "/retrievAllGames");
        fetch(process.env.REACT_APP_API_HOST + "/retrieveAllGames")
        .then(result=>result.json())
        .then(
            (games) => {
                this.setState({games: games})
            },
            (error) => {
                console.log("Error retrieving games: " + error);
            });
    }

    render() {
        //console.log("Rendering GameView: " + JSON.stringify(this.state.games));
        return (
            <p>Game View - Under Construction</p>
        );
    }
}

export default GameView;