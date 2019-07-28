import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import AppContainer from './AppContainer';
import $ from 'jquery';

class App extends Component {
    constructor() {
        super();
        this.state = {
            userToken: "",
            useLoginPage: false
        };
    }

    setLoggedIn = (userToken) => {
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

        console.log(JSON.stringify(props));
        return <AppContainer userToken={this.state.userToken} match={match} view={viewName} />
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
        return this.renderAppContainer("LOGOUT");
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
            <BrowserRouter>
                <Route exact path="/predictGames" render={() => this.renderAppContainer("PREDICTGAMESVIEW")}/>
                <Route exact path="/results" render={() => this.renderAppContainer("PASTPREDICTIONSVIEW")} />
                <Route exact path="/admin" render={() => this.renderAppContainer("ADMINVIEW")} />
                <Route exact path="/leaderboard" render={() => this.renderAppContainer("LEADERBOARDSVIEW")} />
                <Route exact path="/about" render={() => this.renderAppContainer("ABOUTVIEW")} />
                <Route exact path="/posts/predictions/:gameId" render={(props) => this.renderAppContainer("PREDICTIONPOSTSVIEW", props)} />
                <Route exact path="/posts/analysis/:gameId" render={(props) => this.renderAppContainer("ANALYSISVIEW", props)} />
                <Route exact path="/posts/:postId" render={(props) => this.renderAppContainer("BLOGPOSTVIEW", props)} />
                <Route exact path="/addPrediction/:gameId" render={(props) => this.renderAppContainer("ADDPREDICTIONPOSTVIEW", props)} />
                <Route exact path="/addAnalysis/:gameId" render={(props) => this.renderAppContainer("ADDANALYSISVIEW", props)} />
                <Route exact path="/logout" render={() => this.logout()} />
                <Route exact path="/" render={() => this.renderAppContainer("PREDICTGAMESVIEW")} />
            </BrowserRouter>
        );
    }
}

export default App;