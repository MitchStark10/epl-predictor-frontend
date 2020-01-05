import React from 'react';
import LoginApp from '../LoginPage/LoginApp';
import logo from '../soccerball.png';

class LoginRouter {

    getUniqueIdentifier = () => {
        return "LOGINVIEW";
    }

    render = () => {
        return (
            <div>
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p className="Header-Text">ScoreMaster</p>
                </header>
                <LoginApp setLoggedIn={this.props.setLoggedIn} />
            </div>
        );
    }
}

export default LoginRouter;