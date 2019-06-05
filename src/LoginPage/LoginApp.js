import React from 'react';
import NewUserForm from './NewUserForm';
import LoginForm from './LoginForm';
import './Login.css'

class LoginApp extends React.Component {
    constructor(props) {
        super();

        this.LOGIN_FORM = "login";
        this.NEW_USER_FORM = "newUser";
        this.CREATE_NEW_USER_TEXT = "NEW USER";
        this.LOGIN_WITH_EXISTING_ACCOUNT_TEXT = "Login With Existing Account";

        this.state = {
            form: this.LOGIN_FORM,
            buttonText: this.CREATE_NEW_USER_TEXT
        };
    }

    toggleForm(e) {
        if (this.state.form === this.LOGIN_FORM) {
            this.setState({form: this.NEW_USER_FORM, buttonText: this.LOGIN_WITH_EXISTING_ACCOUNT_TEXT});
        } else {
            this.setState({form: this.LOGIN_FORM, buttonText: this.CREATE_NEW_USER_TEXT});
        }
    }

    getForm() {
        if (this.state.form === this.LOGIN_FORM) {
            return (
                <LoginForm setLoggedIn={this.props.setLoggedIn} />
            );
        } else {
            return (
                <NewUserForm setLoggedIn={this.props.setLoggedIn} />
            );
        }
    }

    render() {
        return (
            <div id="loginApp">
                <h1>Login</h1>
                {this.getForm()}
                <button className="SM-Button" id="toggleFormButton" onClick={this.toggleForm.bind(this)}>{this.state.buttonText}</button>
            </div>
        );
        
    }
}

export default LoginApp;