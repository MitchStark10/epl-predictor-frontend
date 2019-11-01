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

    handleDropDownButtonHover = (e) => {
        this.setState({ "selectedDropDownButton": e.target.id });
    }

    hanldeDropDownButtonMouseLeave = () => {
        this.setState({"selectedDropDownButton": ""});
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
        //TODO: Recent posts should be the main view after logging in
        switch (this.state.selectedDropDownButton) {
            case "games":
                return (
                    <div id="GamesDropDownList" className="DropDownList">
                        <button className="SmButton DropDownListButton GameDropDownButton" id="/predictGames" onClick={this.handleButtonClick}>PREDICT GAMES</button>
                        <button className="SmButton DropDownListButton GameDropDownButton" id="/results" onClick={this.handleButtonClick}>RESULTS</button>
                        <button className="SmButton DropDownListButton GameDropDownButton" id="/leaderboard" onClick={this.handleButtonClick}>LEADERBOARD</button>
                    </div>
                );
            case "posts":
                return (
                    <div id="PostsDropDownList" className="DropDownList">
                        <button className="SmButton DropDownListButton GameDropDownButton" id="/recentPosts" onClick={this.handleButtonClick}>RECENT POSTS</button>
                        <button className="SmButton DropDownListButton GameDropDownButton" id="/createPost" onClick={this.handleButtonClick}J>CREATE POST</button>
                    </div>
                );
            case "about":
                return (
                    <div id="AboutDropDownList" className="DropDownList">
                        <button className="SmButton DropDownListButton GameDropDownButton" id="/about" onClick={this.handleButtonClick}>ABOUT</button>
                    </div>
                );
            default:
                break;
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
            <div>
                <div className="HeaderBar" onMouseLeave={this.hanldeDropDownButtonMouseLeave}>
                <h1 className="MainMenuHeaderText">ScoreMaster</h1>
                    <button
                        className="DropDownButton"
                        id="games"
                        onMouseEnter={this.handleDropDownButtonHover}
                    >
                        GAMES
                    </button>

                    <button
                        className="DropDownButton"
                        id="posts"
                        onMouseEnter={this.handleDropDownButtonHover}
                    >
                        POSTS
                    </button>

                    <button
                        className="DropDownButton"
                        id="about"
                        onMouseEnter={this.handleDropDownButtonHover}
                    >
                        ABOUT
                    </button>

                {this.renderDropDownList()}
                </div>

                <button className="SmButton" id="/logout" onClick={this.handleButtonClick}>LOGOUT</button>

            </div>
        );
    }
}

export default AppHeader;