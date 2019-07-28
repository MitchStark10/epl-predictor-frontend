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
            let url = "/api/auth/newUser";

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
                <input type="text" id="username" placeholder="Username" value={this.state.username} onChange={this.handleTextChange.bind(this)}/><br />
                <input type="password" id="password" placeholder="Password" value={this.state.password} onChange={this.handleTextChange.bind(this)}/><br />
                <input type="password" id="confirmedPassword" placeholder="Confirm Password" value={this.state.confirmedPassword} onChange={this.handleTextChange.bind(this)}/><br />
                <button className="SM-Button" id="createNewUser" onClick={this.createNewUser.bind(this)}>CREATE NEW USER</button>
                <p>{this.state.statusMessage}</p>
            </div>
        )
    }
}

export default NewUserForm;