import React, { Component } from 'react';
import $ from 'jquery';
import { slide as Menu } from 'react-burger-menu';
import './MobileHeaderMenu.css';
import { withRouter } from 'react-router-dom';

class MobileHeaderMenu extends Component {
    constructor(props) {
        super();
        this.state = {
            'userToken': props.userToken,
            'isAdmin': false,
            'redirectUrl': '',
            'isMenuOpen': false,
            'refreshCount': 0
        };
    }

    componentDidMount() {
        this.retrieveIsAdmin();
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
                if (statusResponse['Status'] === 'admin') {
                    this.setState({isAdmin: true, redirectUrl: ''});
                }
            })
            .fail((error) => {
                console.log('error: ' + JSON.stringify(error));
            });
    }

    handleButtonClick = (event) => {
        this.setState({
            redirectUrl: event.target.id,
            isMenuOpen: false,
            refreshCount: this.state.refreshCount + 1
        });
    }

    renderAdminView = () => {
        if (this.state.isAdmin) {
            return (
                <button className="SmButton" id="/admin" onClick={this.handleButtonClick}>Admin</button>
            );
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

        return <button className="SmButton" id={buttonId} onClick={this.handleButtonClick}>{buttonText}</button>;
    }

    handleStateChange = (menuState) => {
        this.setState({
            isMenuOpen: menuState.isOpen
        });
    }

    render() {
        return (
            <div className="MobileHeaderBar">
                <h1 className="MainMenuHeader">ScoreMaster</h1>
                <Menu pageWrapId={'page-wrap'} outerContainerId={'App'} isOpen={ this.state.isMenuOpen } onStateChange={(state) => this.handleStateChange(state)} >
                    <button className="SmButton" id="/predictGames" onClick={this.handleButtonClick}>Predict Games</button>
                    <button className="SmButton" id="/results" onClick={this.handleButtonClick}>Results</button>
                    <button className="SmButton" id="/leaderboard" onClick={this.handleButtonClick}>Leaderboards</button>
                    <button className="SmButton" id="/about" onClick={this.handleButtonClick}>About</button>
                    {this.renderAdminView()}
                    {this.renderLoginOrLogoutButton()}
                </Menu>
            </div>
        );
    }
}

export default withRouter(MobileHeaderMenu);
