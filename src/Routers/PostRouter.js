import React from 'react';
import MenuRouter from './MenuRouter';
import BlogPostView from '../BlogPosts/BlogPostView';

class PostRouter {

    getUniqueIdentifier = () => {
        return "POSTVIEW";
    }

    render = (userToken, gameId, postId) => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter userToken={userToken}/>
                <BlogPostView userToken={userToken} postId={postId} />
            </div>
        );
    }
}

export default PostRouter;