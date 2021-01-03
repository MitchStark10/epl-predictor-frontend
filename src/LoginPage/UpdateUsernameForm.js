import React from 'react';
import $ from 'jquery';
import { withRouter } from 'react-router-dom';

export default withRouter(class UpdateUsernameForm extends React.Component {

    constructor(props) {
        super(props);

        console.log('here:', props);
        this.originalUsername = props.userToken;

        this.state = {
            username: props.username || '',
            errorMessage: ''
        };
    }

    submitUsernameUpdateClickHandler = () => {
        $.post('/public/api/auth/updateUsername', {
            currentUsername: this.originalUsername,
            newUsername: this.state.username
        }).then(() => {
            this.props.setLoggedIn(this.state.username);
        }).fail((error) => {
            this.setState({errorMessage: error.statusText});
            setTimeout(() => {
                this.setState({errorMessage: null});
            }, 5000);
        });
    }

    onUsernameChange = (e) => {
        this.setState({username: e.target.value});
    }

    render() {
        return (
            <div id="UpdateUsernameForm">
                <h2>Update Username</h2>
                {this.state.errorMessage ? (<p className='error'>{this.state.errorMessage}</p>) : null}
                <input placeholder="New Username" value={this.state.username} onChange={this.onUsernameChange}/>
                <button id="SubmitUsernameUpdateButton" onClick={this.submitUsernameUpdateClickHandler}>SUBMIT</button>
            </div>
        );
    }
});
