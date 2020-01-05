import React from 'react';
import MenuRouter from './MenuRouter';
import PredictionPostsView from '../BlogPosts/PredictionPostsView';

class PredictionPostRouter {

    getUniqueIdentifier = () => {
        return "PREDICTIONPOSTSVIEW";
    }

    render = (userToken, gameId) => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter />
                <PredictionPostsView postType="PREDICTION" gameId={gameId} />
            </div>
        );
    }
}

export default PredictionPostRouter;