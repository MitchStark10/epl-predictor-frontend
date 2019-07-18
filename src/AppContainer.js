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
import { Redirect } from 'react-router-dom';
import PredictionPostsView from './BlogPosts/PredictionPostsView';
import AddBlogPostView from './BlogPosts/AddBlogPostView';
import BlogPostView from './BlogPosts/BlogPostView';

class AppContainer extends Component {
	constructor() {
		super();

		this.state = {
			redirectUrl: ""
		};
	}

	displayView = () => {
		console.log(this.props.view);
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
		} else if (this.props.view === "PREDICTIONPOSTSVIEW") {
			return (
				<div className={this.props.view}>	
					<MainMenu userToken={this.props.userToken}/>
					<PredictionPostsView postType="PREDICTION" gameId={this.props.match.params.gameId}/>
				</div>
			);
		} else if (this.props.view === "ADDPREDICTIONPOSTVIEW") {
			return (
				<div className={this.props.view}>	
					<MainMenu userToken={this.props.userToken}/>
					<AddBlogPostView userToken={this.props.userToken} postType="PREDICTION" gameId={this.props.match.params.gameId} />
				</div>
			);
		} else if (this.props.view === "ADDANALYSISVIEW") {
			console.log("here");
			return (
				<div className={this.props.view}>
					<MainMenu userToken={this.props.userToken} />
					<AddBlogPostView userToken={this.props.userToken} postType="ANALYSIS" gameId={this.props.match.params.gameId} />
				</div>
			);
		} else if (this.props.view === "ANALYSISVIEW") {
			return (
				<div className={this.props.view}>
					<MainMenu userToken={this.props.userToken} />
					<PredictionPostsView postType="ANALYSIS" gameId={this.props.match.params.gameId}/>
				</div>
			);
		} else if (this.props.view === "BLOGPOSTVIEW") {
			return (
				<div className={this.props.view}>
					<MainMenu userToken={this.props.userToken} />
					<BlogPostView userToken={this.userToken} postId={this.props.match.params.postId} />
				</div>
			)
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
	