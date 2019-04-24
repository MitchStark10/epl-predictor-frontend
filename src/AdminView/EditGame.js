import React, { Component } from 'react';
import $ from 'jquery';

class EditGame extends React.Component {

    constructor(props) {
        super();
        console.log("test: " + JSON.stringify(props));
        this.state = {
            "homeTeamName": props.game["HomeTeamName"],
            "homeTeamScore": props.game["HomeTeamScore"],
            "awayTeamName": props.game["AwayTeamName"],
            "awayTeamScore": props.game["AwayTeamScore"],
            "gameDate": props.game["GameDate"],
            "competition": props.game["Competition"],
            "statusMessage": ""
        };
    }

    submitEdits = () => {
        let url = process.env.REACT_APP_API_HOST + "/games/updateGame/" + this.props.game["GameId"];

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
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
    
        return [year, month, day].join('-');
    }

    render() {
        return (
            <div className="EditSingleGame" key={this.props.game["GameId"]}>
                <label htmlFor="homeTeamName">Home Team Name: </label>
                <input type="text" id="homeTeamName" value={this.state["homeTeamName"]} onChange={this.handleTextChange}/><br />

                <label htmlFor="homeTeamScore">Home Team Score: </label>
                <input type="text" id="homeTeamScore" value={this.state["homeTeamScore"]} onChange={this.handleTextChange}/><br />

                <label htmlFor="awayTeamName">Away Team Name: </label>
                <input type="text" id="awayTeamName" value={this.state["awayTeamName"]} onChange={this.handleTextChange}/><br />

                <label htmlFor="awayTeamScore">Away Team Score: </label>
                <input type="text" id="awayTeamScore" value={this.state["awayTeamScore"]} onChange={this.handleTextChange}/><br />

                <label htmlFor="gameDate">Game Date: </label>
                <input type="date" id="gameDate" value={this.formatDate(this.state["gameDate"])} onChange={this.handleTextChange}/><br />

                <label htmlFor="Competition">Competition: </label>
                <select id="competition" value={this.state["competition"]} onChange={this.handleTextChange}>
                    <option value="English Premier League">English Premier League</option>
                    <option value="Champions League">Champions League</option>
                    <option value="MLS">MLS</option>
                </select><br />

                <button id="updateGame" onClick={this.submitEdits}>Submit Edits</button>
            </div>
        );
    }
}

export default EditGame;