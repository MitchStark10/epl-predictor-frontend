import React, {Component} from 'react';
import $ from 'jquery';
import Cookies from 'js-cookie';

class LoginForm extends Component {

    constructor(props) {
        super();

        this.state = {
            username: "",
            password: "",
            statusMessage: "",
        };

        this.loginWithCookies();
    }

    handleTextChange(e) {
        let newStateObj = {};
        newStateObj[e.target.id] = e.target.value;
        this.setState(newStateObj);
    }

    loginWithCookies() {
        let endpoint = "/auth/login";
        let url = process.env.REACT_APP_API_HOST + endpoint;

        $.ajaxSetup({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        });

        $.post(url)
        .done((response) => {
            this.props.setLoggedIn(Cookies.get('SMLU'));
        })
        .fail((error) => {
            console.log("Error during cookie login: " + error.responseText);
        });
    }

    login() {
        let endpoint = "/auth/login";
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
                <p>{this.state.statusMessage}</p>
                <input type="text" id="username" value={this.state.username} placeholder="Username goes here" onChange={this.handleTextChange.bind(this)}/><br />
                <input type="password" id="password" value={this.state.password} placeholder="Password goes here" onChange={this.handleTextChange.bind(this)}/>

                <button id="login" onClick={this.login.bind(this)}>LOGIN</button>
            </div>
        );
    }
}

export default LoginForm;