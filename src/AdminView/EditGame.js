import React, { Component } from 'react';
import $ from 'jquery';

class EditGame extends Component {

    constructor(props) {
        super();

        this.state = {
            "homeTeamName": props.game["HomeTeamName"],
            "homeTeamScore": props.game["HomeTeamScore"],
            "awayTeamName": props.game["AwayTeamName"],
            "awayTeamScore": props.game["AwayTeamScore"],
            "gameDate": props.game["GameDate"],
            "competition": props.game["Competition"],
            "statusMessage": ""
        };

        for (const key of Object.keys(this.state)) {
            if (this.state[key] === null) {
                this.state[key] = "";
            }
        }
    }

    submitEdits = () => {
        let url = "/api/games/updateGame/" + this.props.game["GameId"];

        console.log("test: " + JSON.stringify(this.state));

        $.post(url, this.state)
        .done((response) => {
            this.setState({"statusMessage": "Successfully updated game"});
        })
        .fail((error) => {
            this.setState({"statusMessage": "Unable to edit game: " + error.responseText});
        });
    }

    handleTextChange = (e) => {
        let newStateObj = {};
        newStateObj[e.target.id] = e.target.value;
        this.setState(newStateObj);
    }

    formatDate = (date) => {
        let dateAloneString = date.toString().substring(0, 10)
        return dateAloneString;
    }

    render() {
        return (
            <div className="EditSingleGame" key={this.props.game["GameId"]}>
                <input type="text" id="homeTeamName" placeholder="Home Team Name" value={this.state["homeTeamName"]} onChange={this.handleTextChange}/><br />
                <input type="int" id="homeTeamScore" placeholder="Home Team Score" value={this.state["homeTeamScore"]} onChange={this.handleTextChange}/><br />
                <input type="text" id="awayTeamName" placeholder="Away Team Name" value={this.state["awayTeamName"]} onChange={this.handleTextChange}/><br />
                <input type="int" id="awayTeamScore" placeholder="Away Team Score" value={this.state["awayTeamScore"]} onChange={this.handleTextChange}/><br />
                <input type="date" id="gameDate" placeholder="Game Date" value={this.formatDate(this.state["gameDate"])} onChange={this.handleTextChange}/><br />
                <select id="competition" placeholder="Competition" value={this.state["competition"]} onChange={this.handleTextChange}>
                    <option value="English Premier League">English Premier League</option>
                    <option value="La Liga">La Liga</option>
                    <option value="Champions League">Champions League</option>
                    <option value="MLS">MLS</option>
                    <option value="International">International</option>
                </select><br />

                <button id="updateGame" onClick={this.submitEdits}>SUBMIT EDITS</button>
            </div>
        );
    }
}

export default EditGame;