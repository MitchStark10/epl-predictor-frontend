import React, { Component } from 'react';
import $ from 'jquery';
import { slide as Menu } from "react-burger-menu";
import './MainMenu.css'
import { Redirect } from 'react-router-dom';

class MainMenu extends Component {
    constructor(props) {
        super();
        this.state = {
            "userToken": props.userToken,
            "isAdmin": false,
            "redirectUrl": ""
        }
    }

    componentDidMount() {
        this.retrieveIsAdmin();
    }

    componentDidUpdate() {
        if (this.state.redirectUrl !== "") {
            this.setState({redirectUrl: ""});
        }
    }

    retrieveIsAdmin() {
        let getUserStatusUrl = "/auth/getUserStatus";
        $.post(getUserStatusUrl, this.state)
        .done((statusResponse) => {
            console.log("Status response: " + JSON.stringify(statusResponse));
            if (statusResponse["Status"] === "admin") {
                this.setState({isAdmin: true, redirectUrl: ""});
            }
        })
        .fail((error) => {
            console.log("error: " + error.status);
        })
    }

    handleButtonClick = (event) => {
        this.setState({redirectUrl: event.target.id});
    }

    renderAdminView = () => {
        if (this.state.isAdmin) {
            return (
                <button className="SM-Button" id="/admin" onClick={this.handleButtonClick}>ADMIN</button>
            )
        }

        return null;
    }

    render() {
        if (this.state.redirectUrl !== "") {
            return <Redirect to={this.state.redirectUrl} />
        }

        //TODO: Move the header, it does not belong in the MainMenu class
        return (
            <div className="HeaderBar">
                <h1 className="MainMenuHeader">ScoreMaster</h1>
                <Menu pageWrapId={"page-wrap"} outerContainerId={"App"} isOpen={ false }>
                    <button className="SM-Button" id="/predictGames" onClick={this.handleButtonClick}>PREDICT GAMES</button>
                    <button className="SM-Button" id="/results" onClick={this.handleButtonClick}>RESULTS</button>
                    <button className="SM-Button" id="/leaderboard" onClick={this.handleButtonClick}>LEADERBOARD</button>
                    <button className="SM-Button" id="/about" onClick={this.handleButtonClick}>ABOUT</button>
                    {this.renderAdminView()}
                    <button className="SM-Button" id="/logout" onClick={this.handleButtonClick}>LOGOUT</button>
                </Menu>
            </div>
        );
    }
}

export default MainMenu;