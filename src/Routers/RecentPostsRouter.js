import React from 'react';
import MenuRouter from './MenuRouter';
import PostFeedView from '../BlogPosts/PostFeedView';

class RecentPostsRouter {

    getUniqueIdentifier = () => {
        return "RECENTPOSTSVIEW";
    }

    render = (userToken) => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter userToken={userToken}/>
                <PostFeedView />
            </div>
        );
    }
}

export default RecentPostsRouter;