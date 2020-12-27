import React from 'react';
import $ from 'jQuery';

export default function UpdateUsernameForm(props) {

    const [usernameValue, setUsernameValue] = React.useState(props.username);
    const [errorMessage, setErrorMessage] = React.useState('');
    
    const submitUsernameUpdateClickHandler = () => {
        $.post('/public/api/auth/updateUsername', {
            currentUsername: props.username,
            newUsername: usernameValue
        }).then(() => {
            //TODO: redirect home
        }).fail((error) => {
            setErrorMessage(error);
        });
    };
    
    
    return (
        <div id="UpdateUsernameForm">
            {errorMesssage ? (<p className='error'>{errorMessage}</p>) : null}
            <input placeholder="Username" value={usernameValue} />
            <button id="SubmitUsernameUpdateButton">SUBMIT</button>
        </div>
    );
};


