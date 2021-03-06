import React, { Component } from 'react';
import $ from 'jquery';

class AddNewGameForm extends Component {

    constructor() {
        super();

        this.state = {
            homeTeamName: '',
            awayTeamName: '',
            gameDate: '',
            competition: 'English Premier League',
            statusMessage: ''
        };
    }

    handleTextChange(e) {
        let newStateObj = {};
        newStateObj[e.target.id] = e.target.value;
        this.setState(newStateObj);
    }

    submitGame = () => {
        let url = '/public/api/admin/addNewGame';

        $.post(url, this.state)
            .done(() => {
                this.setState({statusMessage: 'Successfully added new game!'});
            })
            .fail((error) => {
                this.setState({statusMessage: 'Unable to add new game: ' + error.responseText});
            });
    }

    render() {
        return (
            <div id="newGameForm">
                <input type="text" id="homeTeamName" placeholder="Home Team Name" value={this.state.homeTeamName} onChange={this.handleTextChange.bind(this)}/><br />
                <input type="text" id="awayTeamName" placeholder="Away Team Name" value={this.state.awayTeamName} onChange={this.handleTextChange.bind(this)}/><br />
                <input type="date" id="gameDate" placeholder="Game Date" value={this.state.gameDate} onChange={this.handleTextChange.bind(this)}/><br />
                <select id="competition" placeholder="Competition" onChange={this.handleTextChange.bind(this)}>
                    <option value="English Premier League">English Premier League</option>
                    <option value="La Liga">La Liga</option>
                    <option value="Champions League">Champions League</option>
                    <option value="MLS">MLS</option>
                    <option value="International">International</option>
                </select><br />

                <button className="SmButton"id="addNewGame" onClick={this.submitGame}>ADD NEW GAME</button>
                <p id="statusMessage">{this.state.statusMessage}</p>
            </div>
        );
    }
}

export default AddNewGameForm;
