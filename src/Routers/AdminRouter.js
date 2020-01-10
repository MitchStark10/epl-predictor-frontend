import React from 'react';
import MenuRouter from './MenuRouter';
import AdminView from '../AdminView/AdminView';

class AdminRouter {

    getUniqueIdentifier = () => {
        return "ADMINVIEW";
    }

    render = (userToken) => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter userToken={userToken}/>
                <AdminView />
            </div>
        );
    }
}

export default AdminRouter;