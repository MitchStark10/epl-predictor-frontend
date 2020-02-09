import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import NotFoundPage from './NotFoundPage/NotFoundPage';
import $ from 'jquery';
import PredictGamesRouter from './Routers/PredictGamesRouter';
import PastPredictionsRouter from './Routers/PastPredictionsRouter';
import AdminRouter from './Routers/AdminRouter';
import LeaderboardsRouter from './Routers/LeaderboardsRouter';
import RecentPostsRouter from './Routers/RecentPostsRouter';
import AboutRouter from './Routers/AboutRouter';
import PredictionPostRouter from './Routers/PredictionPostRouter';
import AnalysisRouter from './Routers/AnalysisRouter';
import PostRouter from './Routers/PostRouter';
import CreatePostRouter from './Routers/CreatePostRouter';
import AddPredictionPostRouter from './Routers/AddPredictionPostRouter';
import AddAnalysisPostRouter from './Routers/AddAnalysisPostRouter';
import history from './History';
import LoginRouter from './Routers/LoginRouter';
import AppInternalRouter from './Routers/AppInternalRouter';

class App extends Component {
    constructor() {
        super();
        this.state = {
            userToken: "",
            useLoginPage: false
        };
    }

    setLoggedIn = (userToken) => {
        console.log("Setting logged in: " + userToken);
        this.setState({userToken: userToken});
    }

    componentDidMount() {
        let url = "/public/api/auth/login";

        $.post(url)
        .done((response) => {
            this.setState({userToken: response["username"]});
        })
        .fail((error) => {
            console.log("Error during cookie login: " + error.responseText);
            this.setState({useLoginPage: true})
        });
    }

    renderAppContainer = (viewName, props) => {
        var match = null;
        if (props !== null && props !== undefined) {
            match = props.match;
        }

        return <AppInternalRouter userToken={this.state.userToken} 
                            match={match} 
                            view={viewName} 
                            currentUrl={match.url} />
    }

    logout = () => {
        $.post("/public/api/auth/logout")
        .done((data) => {
            this.setState({userToken: ""});
        })
        .fail((error) => {
            console.log(error);
            this.setState({userToken: ""});
        })

        history.push('/');
    }

    render() {
        if (this.state.userToken === "") {
            if (this.state.useLoginPage) {
                return new LoginRouter().render(this.setLoggedIn);
            } else {
                return null;
            }
            
        }

        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/predictGames" render={(props) => this.renderAppContainer(new PredictGamesRouter().getUniqueIdentifier(), props)}/>
                    <Route exact path="/results" render={(props) => this.renderAppContainer(new PastPredictionsRouter().getUniqueIdentifier(), props)} />
                    <Route exact path="/admin" render={(props) => this.renderAppContainer(new AdminRouter().getUniqueIdentifier(), props)} />
                    <Route exact path="/leaderboard" render={(props) => this.renderAppContainer(new LeaderboardsRouter().getUniqueIdentifier(), props)} />
                    <Route exact path="/recentPosts" render={(props) => this.renderAppContainer(new RecentPostsRouter().getUniqueIdentifier(), props)} />
                    <Route exact path="/about" render={(props) => this.renderAppContainer(new AboutRouter().getUniqueIdentifier(), props)} />
                    <Route exact path="/posts/predictions/:gameId" render={(props) => this.renderAppContainer(new PredictionPostRouter().getUniqueIdentifier(), props)} />
                    <Route exact path="/posts/analysis/:gameId" render={(props) => this.renderAppContainer(new AnalysisRouter().getUniqueIdentifier(), props)} />
                    <Route exact path="/posts/:postId" render={(props) => this.renderAppContainer(new PostRouter().getUniqueIdentifier(), props)} />
                    <Route exact path="/createPost" render={(props) => this.renderAppContainer(new CreatePostRouter().getUniqueIdentifier(), props)} />
                    <Route exact path="/addPrediction/:gameId" render={(props) => this.renderAppContainer(new AddPredictionPostRouter().getUniqueIdentifier(), props)} />
                    <Route exact path="/addAnalysis/:gameId" render={(props) => this.renderAppContainer(new AddAnalysisPostRouter().getUniqueIdentifier(), props)} />
                    <Route exact path="/logout" render={() => this.logout()} />
                    <Route exact path="/" render={(props) => this.renderAppContainer(new PredictGamesRouter().getUniqueIdentifier(), props)} />
                    <Route path="/" render={() => <NotFoundPage />} />
                </Switch>                
            </Router>
        );
    }
}

export default App;