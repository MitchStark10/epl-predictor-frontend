import React from 'react';
import MenuRouter from './MenuRouter';
import AdminView from '../AdminView/AdminView';

class AdminRouter {

    getUniqueIdentifier = () => {
        return "ADMINVIEW";
    }

    render = () => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter />
                <AdminView />
            </div>
        );
    }
}

export default AdminRouter;