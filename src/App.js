import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MainMenu from './MainMenu/MainMenu';
import AdminView from './AdminView/AdminView';
import PredictGamesView from './PredictGames/PredictGames';
import PreviousPredictionsView from './PastPredictions/PastPredictionsView';
import LoginApp from './LoginPage/LoginApp';

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
		} else if (this.state.view === "ABOUTVIEW") {
			return (
				<h1>About View - Under Construction</h1>
			);
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

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p className="Header-Text">EPL Predictor</p>
					<p className="Header-Text">Version: 1.0.0</p>
					<p className="Header-Text">Author: Mitch Stark</p>
				</header>
				{this.displayMenu()}
				{this.displayView()}
			</div>
		);
	}
		
}
	
export default App;
	