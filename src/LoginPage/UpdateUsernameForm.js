import React from 'react';
import $ from 'jquery';

export default class UpdateUsernameForm extends React.Component {

    constructor(props) {
        super();

        this.originalUsername = props.username;

        this.setState({
            username: props.username,
            errorMessage: ''
        });
    }

    submitUsernameUpdateClickHandler() {
        $.post('/public/api/auth/updateUsername', {
            currentUsername: this.originalUsername,
            newUsername: this.state.username
        }).then(() => {
            //TODO: redirect home
        }).fail((error) => {
            this.setState({errorMessage: error});
        });
    }

    onUsernmaeChange(e) {
        this.setState({username: e.target.value});
    }

    render() {
//         return (
//             <div id="UpdateUsernameForm">
//                 {this.state.errorMessage ? (<p className='error'>{this.state.errorMessage}</p>) : null}
//                 <input placeholder="Username" value={this.state.username} onChange={this.onUsernmaeChange}/>
//                 <button id="SubmitUsernameUpdateButton" onClick={this.submitUsernameUpdateClickHandler}>SUBMIT</button>
//             </div> 
//         );
        return (

        )
    }
}
