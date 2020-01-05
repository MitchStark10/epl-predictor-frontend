import React from 'react';
import MenuRouter from './MenuRouter';
import AddBlogPostView from '../BlogPosts/AddBlogPostView';

class AddPredictionPostRouter {

    getUniqueIdentifier = () => {
        return "ADDPREDICTIONPOSTVIEW";
    }

    render = (userToken, gameId) => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter />
                <AddBlogPostView userToken={userToken} postType="PREDICTION" gameId={gameId} />
            </div>
        );
    }
}

export default AddPredictionPostRouter;