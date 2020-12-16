import React, { Component } from 'react';
import '../App.css';
import { withRouter } from 'react-router-dom';
import PredictGamesRouter from './PredictGamesRouter';
import PastPredictionsRouter from './PastPredictionsRouter';
import AdminRouter from './AdminRouter';
import LeaderboardsRouter from './LeaderboardsRouter';
import AboutRouter from './AboutRouter';
import PredictionPostRouter from './PredictionPostRouter';
import AddPredictionPostRouter from './AddPredictionPostRouter';
import AddAnalysisPostRouter from './AddAnalysisPostRouter';
import AnalysisRouter from './AnalysisRouter';
import PostRouter from './PostRouter';
import RecentPostsRouter from './RecentPostsRouter';
import LoginRouter from './LoginRouter';
import CreatePostRouter from './CreatePostRouter';
import RulesRouter from './RulesRouter';

class AppInternalRouter extends Component {
	constructor() {
		super();

		this.viewRouters = [
			new LoginRouter(),
			new PredictGamesRouter(),
			new PastPredictionsRouter(),
			new AdminRouter(),
			new LeaderboardsRouter(),
			new AboutRouter(),
			new PredictionPostRouter(),
			new AddPredictionPostRouter(),
			new AddAnalysisPostRouter(),
			new AnalysisRouter(),
			new PostRouter(),
			new RecentPostsRouter(),
			new CreatePostRouter(),
			new RulesRouter()
		];

		this.state = {
			redirectUrl: ""
		};
	}
	
	componentDidUpdate() {
		if (this.state.redirectUrl !== "") {
			this.props.history.push(this.state.redirectUrl);
			this.setState({redirectUrl: ""});
		}
	}

	displayView = () => {
		const matchingRouter = this.viewRouters.find( (router) => {
			return router.getUniqueIdentifier() === this.props.view;
		});

		if (matchingRouter === null || matchingRouter === undefined) {
			return (
				<h4>Router could not be matched for {this.props.view}. Please contact support.</h4>
			);
		}
		
		let gameId = null;
		let postId = null;
		if (this.props.match !== null && this.props.match !== undefined) {
			gameId = this.props.match.params.gameId;
			postId = this.props.match.params.postId;
		}

		return matchingRouter.render(this.props.userToken, gameId, postId);
	}

	render() {
		return (
			<div className="App">
				{this.displayView()}
			</div>
		);
	}
		
}
	
export default withRouter(AppInternalRouter);
	