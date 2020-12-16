import React from 'react';
import MenuRouter from './MenuRouter';
import RulesView from '../RulesView/RulesView';

class RulesRouter {

    getUniqueIdentifier = () => {
        return "RULESVIEW";
    }

    render = (userToken) => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter userToken={userToken}/>
                <RulesView />
            </div>
        );
    }
}

export default RulesRouter;