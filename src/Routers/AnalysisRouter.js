import React from 'react';
import MenuRouter from './MenuRouter';
import PredictionPostsView from '../BlogPosts/PredictionPostsView';

class AnalysisRouter {

    getUniqueIdentifier = () => {
        return "ANALYSISVIEW";
    }

    render = (userToken, gameId) => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter userToken={userToken}/>
                <PredictionPostsView postType="ANALYSIS" gameId={gameId} />
            </div>
        );
    }

}

export default AnalysisRouter;