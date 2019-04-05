import React, {Component} from 'react';
import $ from 'jquery';

class LoginForm extends Component {

    constructor(props) {
        super();

        this.state = {
            username: "",
            password: "",
            statusMessage: "",
        };
    }

    handleTextChange(e) {
        let newStateObj = {};
        newStateObj[e.target.id] = e.target.value;
        this.setState(newStateObj);
    }

    login() {
        let endpoint = "/login";
        let url = process.env.REACT_APP_API_HOST + endpoint;

        $.post(url, this.state)
        .done((response) => {
            this.props.setLoggedIn(this.state.username);
        })
        .fail((error) => {
            this.setState({statusMessage: "Unable to login: " + error.responseText});
        });
    }

    render() {
        return (
            <div id="loginForm">
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" value={this.state.username} onChange={this.handleTextChange.bind(this)}/><br />

                <label htmlFor="password">Password: </label>
                <input type="password" id="password" value={this.state.password} onChange={this.handleTextChange.bind(this)}/><br />

                <button id="login" onClick={this.login.bind(this)}>Login</button>
                <p>{this.state.statusMessage}</p>
            </div>
        );
    }
}

export default LoginForm;