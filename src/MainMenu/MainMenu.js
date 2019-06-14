import React, { Component } from 'react';
import $ from 'jquery';
import { slide as Menu } from "react-burger-menu";
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
        let getUserStatusUrl = "/auth/getUserStatus";
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
                <button className="SM-Button" id="ADMINVIEW" onClick={this.handleButtonClick}>ADMIN</button>
            )
        }

        return null;
    }

    render() {
        //TODO: Move the header, it does not belong in the MainMenu class
        return (
            <div className="HeaderBar">
                <h1 className="MainMenuHeader">ScoreMaster</h1>
                <Menu pageWrapId={"page-wrap"} outerContainerId={"App"} isOpen={ false }>
                    <button className="SM-Button" id="PREDICTGAMESVIEW" onClick={this.handleButtonClick}>PREDICT GAMES</button>
                    <button className="SM-Button" id="PASTPREDICTIONSVIEW" onClick={this.handleButtonClick}>RESULTS</button>
                    <button className="SM-Button" id="LEADERBOARDSVIEW" onClick={this.handleButtonClick}>LEADERBOARD</button>
                    <button className="SM-Button" id="ABOUTVIEW" onClick={this.handleButtonClick}>ABOUT</button>
                    {this.renderAdminView()}
                    <button className="SM-Button" id="LOGOUT" onClick={this.handleButtonClick}>LOGOUT</button>
                </Menu>
            </div>
        );
    }
}

export default MainMenu;