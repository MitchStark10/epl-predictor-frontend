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

class App extends Component {
	constructor() {
		super();

		this.state = {
			view: "PREDICTGAMESVIEW",
			userToken: ""
		};
	}

	changeToView = (newViewName) => {
		this.setState({view: newViewName});
	}

	setLoggedIn = (userToken) => {
		this.setState({userToken: userToken})
	}

	displayView = () => {
		if (this.state.userToken === "") {
			return (
				<LoginApp setLoggedIn={this.setLoggedIn} />
			);
		} else if (this.state.view === "PREDICTGAMESVIEW") {
			return (
				<PredictGamesView userToken={this.state.userToken}/>
			);
		} else if (this.state.view === "PASTPREDICTIONSVIEW") {
			return (
				<PreviousPredictionsView userToken={this.state.userToken}/>
			);
		} else if (this.state.view === "ADMINVIEW") {
			return (
				<AdminView />
			);
		} else if (this.state.view === "LEADERBOARDSVIEW") {
			return (
				<LeaderboardsView />
			);
		} else if (this.state.view === "ABOUTVIEW") {
			return (
				<AboutView />
			);
		} else if (this.state.view === "LOGOUT") {
			$.ajaxSetup({
				crossDomain: true,
				xhrFields: {
					withCredentials: true
				}
			});
			console.log("Donezo for real");
			$.post(process.env.REACT_APP_API_HOST + "/auth/logout")
			.done((data) => {
				console.log("done logging out");
				window.location.reload();
			})
			.fail((error) => {
				console.log("test");
				window.location.reload();
			})
		} else {
			console.warn("Unknown view: " + this.state.view);
			this.setState({view: "PREDICTGAMESVIEW"});
			//TODO: Default to ALLGAMESVIEW
			return null;
		}
	}

	displayMenu = () => {
		if (this.state.userToken !== "") {
			return (
				<MainMenu changeToView={this.changeToView} userToken={this.state.userToken}/>
			);
		}

		return null;
	}

	displayHeader = () => {
		if (this.state.userToken === "") {
			return (
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p className="Header-Text">ScoreMaster</p>
				</header>
			);
		}

		return null;
	}

	render() {
		return (
			<div className="App">
				{this.displayHeader()}
				{this.displayMenu()}
				{this.displayView()}
			</div>
		);
	}
		
}
	
export default App;
	