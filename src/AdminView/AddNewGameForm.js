import React, { Component } from 'react';
import $ from 'jquery';

class AddNewGameForm extends Component {

    constructor(props) {
        super();

        this.state = {
            homeTeamName: "",
            awayTeamName: "",
            gameDate: "",
            competition: "English Premier League",
            statusMessage: ""
        };
    }

    handleTextChange(e) {
        let newStateObj = {};
        newStateObj[e.target.id] = e.target.value;
        this.setState(newStateObj);
    }

    submitGame = () => {
        console.log(JSON.stringify(this.state));

        let url = process.env.REACT_APP_API_HOST + "/admin/addNewGame";

        $.post(url, this.state)
        .done((response) => {
            this.setState({statusMessage: "Successfully added new game!"});
        })
        .fail((error) => {
            this.setState({statusMessage: "Unable to add new game: " + error.responseText});
        });
    }

    render() {
        return (
            <div id="newGameForm">
                <label htmlFor="homeTeamName">Home Team Name: </label>
                <input type="text" id="homeTeamName" value={this.state.homeTeamName} onChange={this.handleTextChange.bind(this)}/><br />

                <label htmlFor="awayTeamName">Away Team Name: </label>
                <input type="text" id="awayTeamName" value={this.state.awayTeamName} onChange={this.handleTextChange.bind(this)}/><br />

                <label htmlFor="gameDate">Game Date: </label>
                <input type="date" id="gameDate" value={this.state.gameDate} onChange={this.handleTextChange.bind(this)}/><br />

                <label htmlFor="competition">Competition: </label>
                <select id="competition" onChange={this.handleTextChange.bind(this)}>
                    <option value="English Premier League">English Premier League</option>
                    <option value="Champions League">Champions League</option>
                    <option value="MLS">MLS</option>
                </select><br />

                <button id="addNewGame" onClick={this.submitGame}>ADD NEW GAME</button>
                <p id="statusMessage">{this.state.statusMessage}</p>
            </div>
        );
    }
}

export default AddNewGameForm;