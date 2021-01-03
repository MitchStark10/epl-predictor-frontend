import React from 'react';
import MenuRouter from './MenuRouter';
import UpdateUsernameForm from '../LoginPage/UpdateUsernameForm';

class UpdateUsernameRouter {
    getUniqueIdentifier = () => {
        return 'UPDATEUSERNAME';
    }

    render = (userToken) => {
        console.log('user token:', userToken);
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter userToken={userToken}/>
                <UpdateUsernameForm userToken={userToken}/>
            </div>
        );
    }
}

export default UpdateUsernameRouter;
