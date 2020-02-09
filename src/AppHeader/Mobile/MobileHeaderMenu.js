import React, { Component } from 'react';
import $ from 'jquery';
import { slide as Menu } from "react-burger-menu";
import './MobileHeaderMenu.css'
import { withRouter } from 'react-router-dom';

class MobileHeaderMenu extends Component {
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
        let getUserStatusUrl = "/public/api/auth/getUserStatus";
        $.post(getUserStatusUrl, this.state)
        .done((statusResponse) => {
            if (statusResponse["Status"] === "admin") {
                this.setState({isAdmin: true, redirectUrl: ""});
            }
        })
        .fail((error) => {
            console.error("error: " + JSON.stringify(error));
        })
    }

    handleButtonClick = (event) => {
        this.setState({redirectUrl: event.target.id});
    }

    renderAdminView = () => {
        if (this.state.isAdmin) {
            return (
                <button className="SmButton" id="/admin" onClick={this.handleButtonClick}>ADMIN</button>
            )
        }

        return null;
    }

    render() {
        if (this.state.redirectUrl !== "") {
            this.props.history.push(this.state.redirectUrl);
            return null;
        }

        return (
            <div className="MobileHeaderBar">
                <h1 className="MainMenuHeader">ScoreMaster</h1>
                <Menu pageWrapId={"page-wrap"} outerContainerId={"App"} isOpen={ false }>
                    <button className="SmButton" id="/predictGames" onClick={this.handleButtonClick}>PREDICT GAMES</button>
                    <button className="SmButton" id="/results" onClick={this.handleButtonClick}>RESULTS</button>
                    <button className="SmButton" id="/leaderboard" onClick={this.handleButtonClick}>LEADERBOARD</button>
                    <button className="SmButton" id="/about" onClick={this.handleButtonClick}>ABOUT</button>
                    {this.renderAdminView()}
                    <button className="SmButton" id="/logout" onClick={this.handleButtonClick}>LOGOUT</button>
                </Menu>
            </div>
        );
    }
}

export default withRouter(MobileHeaderMenu);