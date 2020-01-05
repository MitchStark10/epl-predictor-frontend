import React from 'react';
import MenuRouter from './MenuRouter';
import LeaderboardsView from '../Leaderboards/LeaderboardsView';

class LeaderboardsRouter {

    getUniqueIdentifier = () => {
        return "LEADERBOARDSVIEW";
    }

    render = () => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter />
                <LeaderboardsView />
            </div>
        );
    }
}

export default LeaderboardsRouter;