import React from 'react';
import MenuRouter from './MenuRouter';
import CreatePostView from '../BlogPosts/CreatePostView';

class CreatePostRouter {

    getUniqueIdentifier = () => {
        return "CREATEPOSTSVIEW";
    }

    render = (userToken) => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter userToken={userToken}/>
                <CreatePostView />
            </div>
        );
    }

}

export default CreatePostRouter;