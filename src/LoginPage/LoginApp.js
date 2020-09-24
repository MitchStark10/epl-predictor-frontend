import React from 'react';
import NewUserForm from './NewUserForm';
import LoginForm from './LoginForm';
import { withRouter } from 'react-router-dom';
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

    onGoogleLoginClick = () => {
        this.props.history.push('/todo'); //TODO: Backend route for google login
    }

    render() {
        return (
            <div id="loginAppContainer">
                <div id="loginApp">
                    <h1>Login</h1>
                    {this.getForm()}
                    <button className="SmButton" id="toggleFormButton" onClick={this.toggleForm.bind(this)}>{this.state.buttonText}</button>

                </div>
                <p>Or</p>
                <div id="GoogleLogin" onClick={this.onGoogleLoginClick}>
                    <img alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                    Login with Google
                </div>
            </div>
        );
        
    }
}

export default withRouter(LoginApp);