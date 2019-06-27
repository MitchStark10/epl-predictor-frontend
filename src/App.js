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
        let url = "/auth/login";

        $.post(url)
        .done((response) => {
            this.setState({userToken: response["username"]});
        })
        .fail((error) => {
            console.log("Error during cookie login: " + error.responseText);
            this.setState({useLoginPage: true})
        });
    }

    renderAppContainer = (viewName) => {
        return <AppContainer userToken={this.state.userToken} view={viewName} />
    }

    logout = () => {
        $.post("/auth/logout")
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
                //TODO: Fix this
                return null;
            }
            
        }

        return (
            <BrowserRouter>
                <Route path="/predictGames" render={() => this.renderAppContainer("PREDICTGAMESVIEW")}/>
                <Route path="/results" render={() => this.renderAppContainer("PASTPREDICTIONSVIEW")} />
                <Route path="/admin" render={() => this.renderAppContainer("ADMINVIEW")} />
                <Route path="/leaderboard" render={() => this.renderAppContainer("LEADERBOARDSVIEW")} />
                <Route path="/about" render={() => this.renderAppContainer("ABOUTVIEW")} />
                <Route path="/logout" render={() => this.logout()} />
                <Route exact path="/" render={() => this.renderAppContainer("PREDICTGAMESVIEW")} />
            </BrowserRouter>
        );
    }
}

export default App;