import React from 'react';
import MenuRouter from './MenuRouter';
import LeaderboardsView from '../Leaderboards/LeaderboardsView';

class LeaderboardsRouter {

    getUniqueIdentifier = () => {
        return "LEADERBOARDSVIEW";
    }

    render = (userToken) => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter userToken={userToken}/>
                <LeaderboardsView />
            </div>
        );
    }
}

export default LeaderboardsRouter;