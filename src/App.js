import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import NotFoundPage from './NotFoundPage/NotFoundPage';
import $ from 'jquery';
import history from './History';
import MenuRouter from './Routers/MenuRouter';
import PredictGamesView from './PredictGames/PredictGames';
import PastPredictionsView from './PastPredictions/PastPredictionsView';
import AdminView from './AdminView/AdminView';
import LeaderboardsView from './Leaderboards/LeaderboardsView';
import PostFeedView from './BlogPosts/PostFeedView';
import AboutView from './AboutView/AboutView';
import PredictionPostsView from './BlogPosts/PredictionPostsView';
import BlogPostView from './BlogPosts/BlogPostView';
import CreatePostView from './BlogPosts/CreatePostView';
import AddBlogPostView from './BlogPosts/AddBlogPostView';
import LoginApp from './LoginPage/LoginApp';
import UpdateUsernameForm from './LoginPage/UpdateUsernameForm';
import './App.css';

class App extends Component {
    constructor() {
        super();
        this.state = {
            userToken: "",
            isCheckingLogin: true
        };
    }

    setLoggedIn = (userToken) => {
        console.log("Setting logged in: " + userToken);
        history.push('/');
        this.setState({userToken: userToken});
    }

    componentDidMount() {
        let url = "/public/api/auth/login";

        $.post(url)
        .done((response) => {
            this.setState({userToken: response["username"], isCheckingLogin: false});
        })
        .fail(() => {
            this.setState({isCheckingLogin: false});
        });
    }

    logout = () => {
        $.post("/public/api/auth/logout")
        .done((data) => {
            this.setState({userToken: ""});
            history.push('/');
        })
        .fail((error) => {
            console.log(error);
            this.setState({userToken: ""});
            history.push('/');
        })

    }

    render() {
        if (this.state.isCheckingLogin) {
            return null;
        }

        return (
            <Router history={history}>
                <MenuRouter userToken={this.state.userToken}/>
                <Switch>
                    <Route exact path="/predictGames">
                        <PredictGamesView userToken={this.state.userToken} />
                    </Route>
                    <Route exact path="/results">
                        <PastPredictionsView userToken={this.state.userToken} />
                    </Route>
                    <Route exact path="/admin">
                        <AdminView />
                    </Route>
                    <Route exact path="/leaderboard">
                        <LeaderboardsView />
                    </Route>
                    <Route exact path="/recentPosts">
                        <PostFeedView />
                    </Route>
                    <Route exact path="/about">
                        <AboutView />
                    </Route>
                    <Route exact path="/posts/predictions/:gameId" render={(props) => <PredictionPostsView postType="PREDICTION" gameId={props.gameId} />} />
                    <Route exact path="/posts/analysis/:gameId" render={(props) => <PredictionPostsView postType="ANALYSIS" gameId={props.gameId} />} />
                    <Route exact path="/posts/:postId" render={(props) => <BlogPostView userToken={this.state.userToken} postId={props.postId} />} />
                    <Route exact path="/createPost">
                        <CreatePostView userToken={this.state.userToken} />
                    </Route>
                    <Route exact path="/addPrediction/:gameId" render={(props) => <AddBlogPostView userToken={this.state.userToken} postType="PREDICTION" gameId={props.gameId}/>} />
                    <Route exact path="/addAnalysis/:gameId" render={(props) => <AddBlogPostView userToken={this.state.userToken} postType="ANALYSIS" gameId={props.gameId} />} />
                    <Route exact path="/logout" render={() => this.logout()} />
                    <Route exact path="/login">
                        <LoginApp setLoggedIn={this.setLoggedIn} />
                    </Route>
                    <Route exact path="/updateUsername">
                        <UpdateUsernameForm setLoggedIn={this.setLoggedIn} userToken={this.state.userToken} />
                    </Route>
                    <Route exact path="/">
                        <PredictGamesView userToken={this.state.userToken} />
                    </Route>
                    <Route path="/" render={() => <NotFoundPage />} />
                </Switch>                
            </Router>
        );
    }
}

export default App;
