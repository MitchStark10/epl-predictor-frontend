import React, { Component } from 'react';
import $ from 'jquery';
import './AppHeader.css'
import { Redirect } from 'react-router-dom';

class AppHeader extends Component {
    constructor(props) {
        super();
        this.state = {
            "userToken": props.userToken,
            "isAdmin": false,
            "redirectUrl": "",
            "selectedDropDownButton": ""
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
        this.setState({redirectUrl: event.target.id});
    }

    handleDropDownButtonClick = (e) => {
        if (this.state.selectedDropDownButton === e.target.id) {
            this.setState({"selectedDropDownButton": ""});   
        } else {
            this.setState({"selectedDropDownButton": e.target.id});
        }
    }

    renderAdminButton = () => {
        if (this.state.isAdmin) {
            return (
                <button className="SmButton" id="/admin" onClick={this.handleButtonClick}>ADMIN</button>
            )
        }

        return null;
    }

    renderDropDownList = () => {
        switch (this.state.selectedDropDownButton) {
            case "games":
                return (
                    <div id="GamesDropDownList">
                        <br />
                        <button className="SmButton" id="/predictGames" onClick={this.handleButtonClick}>PREDICT GAMES</button>
                        <button className="SmButton" id="/results" onClick={this.handleButtonClick}>RESULTS</button>
                        <button className="SmButton" id="/leaderboard" onClick={this.handleButtonClick}>LEADERBOARD</button>
                    </div>
                );
            case "posts":
                return (
                    <div id="PostsDropDownList">
                        <br />
                        <h1>TODO: Built posts pages</h1>
                    </div>
                );
            case "about":
                return (
                    <div id="AboutDropDownList">
                        <br />
                        <button className="SmButton" id="/about" onClick={this.handleButtonClick}>ABOUT</button>
                    </div>
                );
            default:
                return null;
        }
    }

    render() {
        console.log("Testing during rendering: " + JSON.stringify(this.props.urlBackHistoryList));
        if (this.state.redirectUrl !== "") {
            return <Redirect to={this.state.redirectUrl} />
        }

        //TODO: Display the below buttons under their appropriate menu category
        // <button className="SmButton" id="/logout" onClick={this.handleButtonClick}>LOGOUT</button>
        // <button className="SmButton" id="/about" onClick={this.handleButtonClick}>ABOUT</button>
 
        return (
            <div className="HeaderBar">
                <h1 className="MainMenuHeaderText">ScoreMaster</h1>
                <button className="DropDownButton" id="games"
                    onMouseEnter={this.handleDropDownButtonClick}
                    onMouseLeave={this.handleDropDownButtonClick}
                >
                    GAMES
                </button>
                <button className="DropDownButton" id="posts">POSTS</button>
                <button className="DropDownButton" id="about">ABOUT</button>
                <button className="SmButton" id="/logout" onClick={this.handleButtonClick}>LOGOUT</button>
                {this.renderDropDownList()}
            </div>
        );
    }
}

export default AppHeader;