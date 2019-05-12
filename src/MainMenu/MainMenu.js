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
        console.log("componeentDidMount");
        this.retrieveIsAdmin();
    }

    retrieveIsAdmin() {
        console.log("Admin view test: " + this.state.userToken)

        let getUserStatusUrl = process.env.REACT_APP_API_HOST + "/auth/getUserStatus";
        $.post(getUserStatusUrl, this.state)
        .done((statusResponse) => {
            console.log(statusResponse["Status"] === "admin");
            if (statusResponse["Status"] === "admin") {
                console.log("here");
                this.setState({isAdmin: true});
            }
        })
        .fail((error) => {
            console.log("error: " + error.status);
        })
    }

    handleButtonClick = (event) => {
        console.log("Clicked Main Menu Button: " + event.target.id);
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
                <button className="Main-Menu" id="PASTPREDICTIONSVIEW" onClick={this.handleButtonClick}>RESULTS</button>
                <button className="Main-Menu" id="PREDICTGAMESVIEW" onClick={this.handleButtonClick}>PREDICT GAMES</button>
                <button className="Main-Menu" id="LEADERBOARDSVIEW" onClick={this.handleButtonClick}>LEADERBOARD</button>
                {this.renderAdminView()}
                <button className="Main-Menu" id="ABOUTVIEW" onClick={this.handleButtonClick}>ABOUT</button>
            </div>
        );
    }
}

export default MainMenu;