import React, { Component } from 'react';
import logo from './soccerball.png';
import './App.css';
import MainMenu from './MainMenu/MainMenu';
import AdminView from './AdminView/AdminView';
import PredictGamesView from './PredictGames/PredictGames';
import PreviousPredictionsView from './PastPredictions/PastPredictionsView';
import LoginApp from './LoginPage/LoginApp';
import LeaderboardsView from './Leaderboards/LeaderboardsView';
import AboutView from './AboutView/AboutView';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';

class AppContainer extends Component {
	constructor() {
		super();

		this.state = {
			redirectUrl: ""
		};
	}

	displayView = () => {
		if (this.props.view === "LOGINVIEW") {
			return (
				<div>
					<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p className="Header-Text">ScoreMaster</p>
					</header>
					<LoginApp setLoggedIn={this.props.setLoggedIn} />
				</div>
			);
		} else if (this.props.view === "PREDICTGAMESVIEW") {
			return (
				<div className={this.props.view}>
					<MainMenu userToken={this.props.userToken}/>
					<PredictGamesView userToken={this.props.userToken}/>
				</div>		
			);
		} else if (this.props.view === "PASTPREDICTIONSVIEW") {
			console.log("returning past predictons view")
			return (
				<div className={this.props.view}>
					<MainMenu userToken={this.props.userToken}/>
					<PreviousPredictionsView userToken={this.props.userToken}/>
				</div>
			);
		} else if (this.props.view === "ADMINVIEW") {
			return (
				<div className={this.props.view}>
					<MainMenu userToken={this.props.userToken}/>
					<AdminView />
				</div>
			);
		} else if (this.props.view === "LEADERBOARDSVIEW") {
			return (
				<div className={this.props.view}>
					<MainMenu userToken={this.props.userToken}/>
					<LeaderboardsView />
				</div>
			);
		} else if (this.props.view === "ABOUTVIEW") {
			return (
				<div className={this.props.view}>
					<MainMenu userToken={this.props.userToken}/>
					<AboutView />
				</div>
			);
		} else if (this.props.view === "LOGOUT") {
			this.setState({redirectUrl: "/"});
			
		} else {
			console.warn("Unknown view: " + this.props.view);
			this.setState({redirectUrl: "/"});
		}
	}

	render() {
		
		if (this.state.redirectUrl !== "") {
			return <Redirect to={this.state.redirectUrl} />
		}

		console.log("rendering with view: " + this.props.view)
		return (
			<div className="App">
				{this.displayView()}
			</div>
		);
	}
		
}
	
export default AppContainer;
	