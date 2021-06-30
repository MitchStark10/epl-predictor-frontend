import React, { Component } from 'react';
import $ from 'jquery';
import './DesktopHeaderMenu.css';
import { withRouter } from 'react-router-dom';

class DesktopHeaderMenu extends Component {
    constructor(props) {
        super();
        this.state = {
            'userToken': props.userToken,
            'isAdmin': false,
            'redirectUrl': '',
            'selectedDropDownButton': ''
        };
    }

    componentDidMount() {
        if (this.state.redirectUrl === '') {
            this.retrieveIsAdmin();
        }
    }

    componentDidUpdate() {
        if (this.state.redirectUrl !== '') {
            this.props.history.push(this.state.redirectUrl);
            this.setState({redirectUrl: ''});
        }
    }

    retrieveIsAdmin() {
        let getUserStatusUrl = '/public/api/auth/getUserStatus';
        $.post(getUserStatusUrl, this.state)
            .done((statusResponse) => {
                console.log('Status response: ' + JSON.stringify(statusResponse));
                if (statusResponse['Status'] === 'admin' && this.state.redirectUrl === '') {
                    this.setState({isAdmin: true, redirectUrl: ''});
                }
            })
            .fail((error) => {
                console.error('error: ' + JSON.stringify(error));
            });
    }

    handleButtonClick = (event) => {
        this.setState({redirectUrl: event.target.id, selectedDropDownButton: null});
    }

    handleDropDownButtonHover = (e) => {
        this.setState({'selectedDropDownButton': e.target.id});
    }

    hanldeDropDownButtonMouseLeave = () => {
        this.setState({'selectedDropDownButton': ''});
    }

    renderAdminButton = () => {
        console.log(this.state.isAdmin);
        if (this.state.isAdmin) {
            return (
                <button className="SmButton" id="/admin" onClick={this.handleButtonClick}>Admin</button>
            );
        }

        return null;
    }

    renderLoggedInUser = () => {
        if (this.props.showLoggedInUser && this.props.userToken) {
            return <h4 id="userTag">Logged in: {this.props.userToken}</h4>;
        }

        return null;
    }

    renderLoginOrLogoutButton = () => {
        let buttonText, buttonId;

        if (this.props.userToken) {
            buttonText = 'Logout';
            buttonId = '/logout';
        } else {
            buttonText = 'Login';
            buttonId = '/login';
        }

        return (
            <button className="SmButton DesktopLogout" id={buttonId} onClick={this.handleButtonClick}>{buttonText}</button>
        );
    }

    render() {
        return (
            <div>
                <div className="DesktopHeaderBar" onMouseLeave={this.hanldeDropDownButtonMouseLeave}>
                    <a href="/"><h1 className="MainMenuHeaderText">ScoreMaster</h1></a>
                    <div className="DropDownContainer">
                        <button
                            className="DropDownButton"
                            id="games"
                            onMouseEnter={this.handleDropDownButtonHover}
                        >
                            Games
                        </button>
                        {this.state.selectedDropDownButton === 'games' ?
                            <div className="DropDownList">
                                <button className="SmButton DropDownListButton GameDropDownButton" id="/predictGames" onClick={this.handleButtonClick}>Predict Games</button><br />
                                <button className="SmButton DropDownListButton GameDropDownButton" id="/results" onClick={this.handleButtonClick}>Results</button><br />
                                <button className="SmButton DropDownListbutton GameDropDownButton" id="/leaderboard" onClick={this.handleButtonClick}>Leaderboards</button><br />
                                {this.renderAdminButton()}
                            </div>
                            : null}
                    </div>

                    {/* Commented out until better post support <button
                        className="DropDownButton"
                        id="posts"
                        onMouseEnter={this.handleDropDownButtonHover}
                    >
                        POSTS
                    </button> */}

                    <div className="DropDownContainer">
                        <a href="/about">
                            <button
                                className="DropDownButton"
                                id="about"
                                onMouseEnter={this.handleDropDownButtonHover}
                            >
                            About
                            </button>
                        </a>
                    </div>

                    {this.renderLoggedInUser()}
                    {this.renderLoginOrLogoutButton()}
                </div>
            </div>
        );
    }
}

export default withRouter(DesktopHeaderMenu);
