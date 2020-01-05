import React from 'react';
import MenuRouter from './MenuRouter';
import AddBlogPostView from '../BlogPosts/AddBlogPostView';

class AddAnalysisPostRouter {
    getUniqueIdentifier = () => {
        return "ADDANALYSISPOSTVIEW";
    }

    render = (userToken, gameId) => {
        //ANALYSIS as a constant
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter />
                <AddBlogPostView userToken={userToken} postType="ANALYSIS" gameId={gameId} />
            </div>
        );
    }
}

export default AddAnalysisPostRouter;