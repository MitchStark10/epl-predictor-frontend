import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MainMenu from './MainMenu';

class App extends Component {
	constructor() {
		super();

		this.state = {
			view: "ALLGAMESVIEW"
		};
	}

	changeToView = (newViewName) => {
		this.setState({view: newViewName});
	}

	displayView = () => {
		if (this.state.view === "ALLGAMESVIEW") {
			return (
				<p>Game View - Under Construction</p>
			);
		} else if (this.state.view === "BLOGVIEW") {
			return (
				<p>Blog View - Under Construction</p>
			);
		} else if (this.state.view === "ABOUTVIEW") {
			return (
				<p>About View - Under Construction</p>
			);
		} else {
			console.warn("Unknown view: " + this.state.view);
			this.setState({view: "ALLGAMESVIEW"});
			//TODO: Default to ALLGAMESVIEW
			return null;
		}
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p className="Header-Text">EPL Predictor</p>
					<p className="Header-Text">Prediction Version: 1.0.0</p>
					<p className="Header-Text">Website Version: 1.0.0</p>
					<p className="Header-Text">Author: Mitch Stark</p>
				</header>
				<MainMenu changeToView={this.changeToView}/>
				{this.displayView()}
			</div>
			);
		}
	}
	
	export default App;
	