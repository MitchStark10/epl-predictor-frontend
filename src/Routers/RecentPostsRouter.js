import React from 'react';
import MenuRouter from './MenuRouter';
import PostFeedView from '../BlogPosts/PostFeedView';

class RecentPostsRouter {

    getUniqueIdentifier = () => {
        return "RECENTPOSTSVIEW";
    }

    render = () => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter />
                <PostFeedView />
            </div>
        );
    }
}

export default RecentPostsRouter;