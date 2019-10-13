import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AppContainer from './AppContainer';
import NotFoundPage from './NotFoundPage/NotFoundPage';
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

        console.log("test: " + this.state.userToken);
        return <AppContainer userToken={this.state.userToken} 
                            match={match} 
                            view={viewName} 
                            currentUrl={match.url} 
                            urlBackHistoryList={this.state.urlBackHistoryList}
                            urlForwardHistoryList={this.state.urlForwardHistoryList}/>
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
        return <Redirect to="/"/>;
    }

    render() {
        if (this.state.userToken === "") {
            if (this.state.useLoginPage) {
                return <AppContainer view="LOGINVIEW" setLoggedIn={this.setLoggedIn}/>
            } else {
                return null;
            }
            
        }

        return (
            <BrowserRouter history={BrowserHistory}>
                <Switch>
                    <Route exact path="/predictGames" render={(props) => this.renderAppContainer("PREDICTGAMESVIEW", props)}/>
                    <Route exact path="/results" render={(props) => this.renderAppContainer("PASTPREDICTIONSVIEW", props)} />
                    <Route exact path="/admin" render={(props) => this.renderAppContainer("ADMINVIEW", props)} />
                    <Route exact path="/leaderboard" render={(props) => this.renderAppContainer("LEADERBOARDSVIEW", props)} />
                    <Route exact path="/about" render={(props) => this.renderAppContainer("ABOUTVIEW", props)} />
                    <Route exact path="/posts/predictions/:gameId" render={(props) => this.renderAppContainer("PREDICTIONPOSTSVIEW", props)} />
                    <Route exact path="/posts/analysis/:gameId" render={(props) => this.renderAppContainer("ANALYSISVIEW", props)} />
                    <Route exact path="/posts/:postId" render={(props) => this.renderAppContainer("BLOGPOSTVIEW", props)} />
                    <Route exact path="/addPrediction/:gameId" render={(props) => this.renderAppContainer("ADDPREDICTIONPOSTVIEW", props)} />
                    <Route exact path="/addAnalysis/:gameId" render={(props) => this.renderAppContainer("ADDANALYSISVIEW", props)} />
                    <Route exact path="/logout" render={() => this.logout()} />
                    <Route exact path="/" render={(props) => this.renderAppContainer("PREDICTGAMESVIEW", props)} />
                    <Route path="/" render={() => <NotFoundPage />} />
                </Switch>                
            </BrowserRouter>
        );
    }
}

export default App;