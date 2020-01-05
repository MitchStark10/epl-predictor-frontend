import React from 'react';
import MenuRouter from './MenuRouter';
import CreatePostView from '../BlogPosts/CreatePostView';

class CreatePostRouter {

    getUniqueIdentifier = () => {
        return "CREATEPOSTSVIEW";
    }

    render = () => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter />
                <CreatePostView />
            </div>
        );
    }

}

export default CreatePostRouter;