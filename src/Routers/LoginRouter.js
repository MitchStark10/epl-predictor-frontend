import React from 'react';
import LoginApp from '../LoginPage/LoginApp';
import logo from '../soccerball.png';
import MenuRouter from './MenuRouter';

class LoginRouter {

    getUniqueIdentifier = () => {
        return "LOGINVIEW";
    }

    render = (setLoggedIn) => {
        return (
            <div>
                <MenuRouter />
                <LoginApp setLoggedIn={setLoggedIn} />
            </div>
        );
    }
}

export default LoginRouter;