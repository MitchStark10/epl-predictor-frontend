import React from 'react';
import $ from 'jquery';

class NewUserForm extends React.Component {
    constructor(props) {
        super();

        this.state = {
            username: "",
            password: "",
            confirmedPassword: "",
            statusMessage: ""
        }
    }

    handleTextChange(e) {
        let newStateObj = {};
        newStateObj[e.target.id] = e.target.value;
        this.setState(newStateObj);
    }

    createNewUser() {
        if (this.state.password === this.state.confirmedPassword) {
            //send to server
            let endpoint = "/auth/newUser";
            let url = process.env.REACT_APP_API_HOST + endpoint;

            console.log("testing: " + JSON.stringify(this.state));

            $.post(url, this.state)
            .done((response) => {
                this.props.setLoggedIn(this.state.username);
            })
            .fail((error) => {
                this.setState({statusMessage: "Failed to create new user: " + error.responseText});
            });
        } else {
            this.setState({statusMessage: "Passwords did not match."})
        }
    }

    render() {
        return (
            <div id="newUserForm">
                <label for="username">Username: </label>
                <input type="text" id="username" value={this.state.username} onChange={this.handleTextChange.bind(this)}/><br />

                <label for="password">Password: </label>
                <input type="password" id="password" value={this.state.password} onChange={this.handleTextChange.bind(this)}/><br />

                <label for="confirmedPassword">Confrim Password: </label>
                <input type="password" id="confirmedPassword" value={this.state.confirmedPassword} onChange={this.handleTextChange.bind(this)}/><br />

                <button id="createNewUser" onClick={this.createNewUser.bind(this)}>CREATE NEW USER</button>
                <p>{this.state.statusMessage}</p>
            </div>
        )
    }
}

export default NewUserForm;