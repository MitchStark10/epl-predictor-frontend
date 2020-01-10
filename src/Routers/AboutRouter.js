import React from 'react';
import MenuRouter from './MenuRouter';
import AboutView from '../AboutView/AboutView';

class AboutRouter {

    getUniqueIdentifier = () => {
        return "ABOUTVIEW";
    }

    render = () => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter userToken={this.props.userToken}/>
                <AboutView />
            </div>
        );
    }
}

export default AboutRouter;