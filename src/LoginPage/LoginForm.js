import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

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
        let url = "/public/api/auth/login";

        $.post(url)
        .done((response) => {
            this.props.setLoggedIn(response["username"]);
        })
        .fail((error) => {
            console.log("Error during cookie login: " + error.responseText);
        });
    }

    login() {
        let url = "/public/api/auth/login";

        $.post(url, this.state)
        .done((response) => {
            this.props.setLoggedIn(this.state.username);
            //TODO: Use a redirect parameter to determine where to send the user
            this.props.history.push('/');
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

                <button className="SmButton" id="login" onClick={this.login.bind(this)}>LOGIN</button>
            </div>
        );
    }
}

export default withRouter(LoginForm);