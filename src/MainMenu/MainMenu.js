import React, { Component } from 'react';
import $ from 'jquery';
import './MainMenu.css'

class MainMenu extends Component {
    constructor(props) {
        super();
        this.state = {
            "userToken": props.userToken,
            "isAdmin": false
        }
    }

    componentDidMount() {
        this.retrieveIsAdmin();
    }

    retrieveIsAdmin() {
        let getUserStatusUrl = process.env.REACT_APP_API_HOST + "/auth/getUserStatus";
        $.post(getUserStatusUrl, this.state)
        .done((statusResponse) => {
            if (statusResponse["Status"] === "admin") {
                this.setState({isAdmin: true});
            }
        })
        .fail((error) => {
            console.log("error: " + error.status);
        })
    }

    handleButtonClick = (event) => {
        this.props.changeToView(event.target.id);
    }

    renderAdminView = () => {
        if (this.state.isAdmin) {
            return (
                <button className="Main-Menu" id="ADMINVIEW" onClick={this.handleButtonClick}>ADMIN</button>
            )
        }

        return null;
    }

    render() {
        return (
            <div className="Main-Menu-Buttons">
                <h1 className="MainMenuHeader">ScoreMaster</h1>
                {this.renderAdminView()}
                <button className="Main-Menu" id="PASTPREDICTIONSVIEW" onClick={this.handleButtonClick}>RESULTS</button>
                <button className="Main-Menu" id="PREDICTGAMESVIEW" onClick={this.handleButtonClick}>PREDICT GAMES</button>
                <button className="Main-Menu" id="LEADERBOARDSVIEW" onClick={this.handleButtonClick}>LEADERBOARD</button>
                <button className="Main-Menu" id="LOGOUT" onClick={this.handleButtonClick}>LOGOUT</button>
                <button className="Main-Menu" id="ABOUTVIEW" onClick={this.handleButtonClick}>ABOUT</button>
            </div>
        );
    }
}

export default MainMenu;