import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AppContainer from './Routers/AppInternalRouter';
import NotFoundPage from './NotFoundPage/NotFoundPage';
import * as ViewConstants from './ViewConstants';
import $ from 'jquery';
const BrowserHistory = require('history').default;

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
        let url = "/api/auth/login";

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

        return <AppContainer userToken={this.state.userToken} 
                            match={match} 
                            view={viewName} 
                            currentUrl={match.url} />
    }

    logout = () => {
        $.post("/api/auth/logout")
        .done((data) => {
            this.setState({userToken: ""});
        })
        .fail((error) => {
            console.log(error);
            this.setState({userToken: ""});
        })
        return <Redirect to="/" />;
    }

    render() {
        if (this.state.userToken === "") {
            if (this.state.useLoginPage) {
                return <AppContainer view={ViewConstants.LOGIN_VIEW} setLoggedIn={this.setLoggedIn}/>
            } else {
                return null;
            }
            
        }

        return (
            <BrowserRouter history={BrowserHistory}>
                <Switch>
                    <Route exact path="/predictGames" render={(props) => this.renderAppContainer(ViewConstants.PREDICT_GAMES_VIEW, props)}/>
                    <Route exact path="/results" render={(props) => this.renderAppContainer(ViewConstants.PAST_PREDICTIONS_VIEW, props)} />
                    <Route exact path="/admin" render={(props) => this.renderAppContainer(ViewConstants.ADMIN_VIEW, props)} />
                    <Route exact path="/leaderboard" render={(props) => this.renderAppContainer(ViewConstants.LEADERBOARDS_VIEW, props)} />
                    <Route exact path="/recentPosts" render={(props) => this.renderAppContainer(ViewConstants.RECENT_POSTS_VIEW, props)} />
                    <Route exact path="/about" render={(props) => this.renderAppContainer(ViewConstants.ABOUT_VIEW, props)} />
                    <Route exact path="/posts/predictions/:gameId" render={(props) => this.renderAppContainer(ViewConstants.PREDICTION_POSTS_VIEW, props)} />
                    <Route exact path="/posts/analysis/:gameId" render={(props) => this.renderAppContainer(ViewConstants.ANALYSIS_VIEW, props)} />
                    <Route exact path="/posts/:postId" render={(props) => this.renderAppContainer(ViewConstants.BLOG_POST_VIEW, props)} />
                    <Route exact path="/createPost" render={(props) => this.renderAppContainer(ViewConstants.CREATE_POST_VIEW, props)} />
                    <Route exact path="/addPrediction/:gameId" render={(props) => this.renderAppContainer(ViewConstants.ADDED_PREDICTION_POST_VIEW, props)} />
                    <Route exact path="/addAnalysis/:gameId" render={(props) => this.renderAppContainer(ViewConstants.ADD_ANALYSIS_VIEW, props)} />
                    <Route exact path="/logout" render={() => this.logout()} />
                    <Route exact path="/" render={(props) => this.renderAppContainer(ViewConstants.PREDICT_GAMES_VIEW, props)} />
                    <Route path="/" render={() => <NotFoundPage />} />
                </Switch>                
            </BrowserRouter>
        );
    }
}

export default App;