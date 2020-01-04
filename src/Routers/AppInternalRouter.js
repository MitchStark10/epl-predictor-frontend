import React, { Component } from 'react';
import logo from '../soccerball.png';
import '../App.css';
import AdminView from '../AdminView/AdminView';
import PreviousPredictionsView from '../PastPredictions/PastPredictionsView';
import LoginApp from '../LoginPage/LoginApp';
import LeaderboardsView from '../Leaderboards/LeaderboardsView';
import AboutView from '../AboutView/AboutView';
import { Redirect } from 'react-router-dom';
import PredictionPostsView from '../BlogPosts/PredictionPostsView';
import AddBlogPostView from '../BlogPosts/AddBlogPostView';
import BlogPostView from '../BlogPosts/BlogPostView';
import PostFeedView from '../BlogPosts/PostFeedView';
import CreatePostView from '../BlogPosts/CreatePostView';
import PredictGamesRouter from './PredictGamesRouter';
import MenuRouter from './DefaultMenu';

class AppContainer extends Component {
	constructor() {
		super();

		this.viewRouters = [
			
		];

		this.state = {
			redirectUrl: ""
		};
	}

	createDefaultMainMenu() {
		return <MenuRouter />
	}

	displayView = () => {
		//TODO: This desperately needs to be refactored
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
			console.log("here: " + this.props.userToken);
			return new PredictGamesRouter().render(this.props.view, this.props.userToken);
		} else if (this.props.view === "PASTPREDICTIONSVIEW") {
			console.log("returning past predictons view")
			return (
				<div className={this.props.view}>
					{this.createDefaultMainMenu()}
					<PreviousPredictionsView userToken={this.props.userToken}/>
				</div>
			);
		} else if (this.props.view === "ADMINVIEW") {
			return (
				<div className={this.props.view}>
					{this.createDefaultMainMenu()}
					<AdminView />
				</div>
			);
		} else if (this.props.view === "LEADERBOARDSVIEW") {
			return (
				<div className={this.props.view}>
					{this.createDefaultMainMenu()}
					<LeaderboardsView />
				</div>
			);
		} else if (this.props.view === "ABOUTVIEW") {
			return (
				<div className={this.props.view}>
					{this.createDefaultMainMenu()}
					<AboutView />
				</div>
			);
		} else if (this.props.view === "PREDICTIONPOSTSVIEW") {
			return (
				<div className={this.props.view}>	
					{this.createDefaultMainMenu()}
					<PredictionPostsView postType="PREDICTION" gameId={this.props.match.params.gameId}/>
				</div>
			);
		} else if (this.props.view === "ADDPREDICTIONPOSTVIEW") {
			return (
				<div className={this.props.view}>	
					{this.createDefaultMainMenu()}
					<AddBlogPostView userToken={this.props.userToken} postType="PREDICTION" gameId={this.props.match.params.gameId} />
				</div>
			);
		} else if (this.props.view === "ADDANALYSISVIEW") {
			console.log("here");
			return (
				<div className={this.props.view}>
					{this.createDefaultMainMenu()}
					<AddBlogPostView userToken={this.props.userToken} postType="ANALYSIS" gameId={this.props.match.params.gameId} />
				</div>
			);
		} else if (this.props.view === "ANALYSISVIEW") {
			return (
				<div className={this.props.view}>
					{this.createDefaultMainMenu()}
					<PredictionPostsView postType="ANALYSIS" gameId={this.props.match.params.gameId}/>
				</div>
			);
		} else if (this.props.view === "BLOGPOSTVIEW") {
			return (
				<div className={this.props.view}>
					{this.createDefaultMainMenu()}
					<BlogPostView userToken={this.props.userToken} postId={this.props.match.params.postId} />
				</div>
			)

		} else if (this.props.view === "RECENTPOSTSVIEW") {
			return (
				<div className={this.props.view}>
					{this.createDefaultMainMenu()}
					<PostFeedView />
				</div>
			);
		} else if (this.props.view === "CREATEPOSTVIEW") {
			return (
				<div className={this.props.view}>
					{this.createDefaultMainMenu()}
					<CreatePostView />
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

		return (
			<div className="App">
				{this.displayView()}
			</div>
		);
	}
		
}
	
export default AppContainer;
	