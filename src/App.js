import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	constructor() {
		super();

		this.state = {
			view: "ALLGAMES"
		};
	}

	displayView = () => {
		if (this.state.view === "ALLGAMES") {
			return (
				<p>All game view</p>
			);
		} else {
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
				{this.displayView()}
			</div>
			);
		}
	}
	
	export default App;
	