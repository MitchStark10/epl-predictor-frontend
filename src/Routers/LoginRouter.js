import React from 'react';
import LoginApp from '../LoginPage/LoginApp';
import logo from '../soccerball.png';

class LoginRouter {

    getUniqueIdentifier = () => {
        return "LOGINVIEW";
    }

    render = (setLoggedIn) => {
        return (
            <div>
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p className="Header-Text">ScoreMaster</p>
                </header>
                <LoginApp setLoggedIn={setLoggedIn} />
            </div>
        );
    }
}

export default LoginRouter;