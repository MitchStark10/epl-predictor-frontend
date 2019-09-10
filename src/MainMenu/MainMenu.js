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
        let getUserStatusUrl = "/api/auth/getUserStatus";
        $.post(getUserStatusUrl, this.state)
        .done((statusResponse) => {
            console.log("Status response: " + JSON.stringify(statusResponse));
            if (statusResponse["status"] === "admin") {
                this.setState({isAdmin: true, redirectUrl: ""});
            }
        })
        .fail((error) => {
            console.log("error: " + error.status);
        })
    }

    handleButtonClick = (event) => {
        console.log("About to add")
        this.props.urlBackHistoryList.push(this.props.currentUrl);
        console.log("Done adding: " + JSON.stringify(this.props.urlBackHistoryList));
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

    goBack = () => {
        console.log("Attempting to go back a page: " + JSON.stringify(this.props.urlBackHistoryList));
        if (this.props.urlBackHistoryList.length > 0) {
            this.props.urlForwardHistoryList.push(this.props.currentUrl);
            this.setState({redirectUrl: this.props.urlBackHistoryList.pop()});
        }
    }

    goForward = () => {
        console.log("Attempting to go forward a page: " + JSON.stringify(this.props.urlForwardHistoryList));
        if (this.props.urlForwardHistoryList.length > 0) {
            this.props.urlBackHistoryList.push(this.props.currentUrl);
            this.setState({redirectUrl: this.props.urlForwardHistoryList.pop()});
        }
    }

    render() {
        console.log("Testing during rendering: " + JSON.stringify(this.props.urlBackHistoryList));
        if (this.state.redirectUrl !== "") {
            return <Redirect to={this.state.redirectUrl} />
        }

        //TODO: Move the header, it does not belong in the MainMenu class
        return (
            <div className="HeaderBar">
                <h1 className="MainMenuHeader">ScoreMaster</h1>
                <Menu pageWrapId={"page-wrap"} outerContainerId={"App"} isOpen={ false }>
                    <button className="SM-Button" onClick={this.goBack}>BACK</button>
                    <button className="SM-Button" onClick={this.goForward}>FORWARD</button><br />
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