import React, { Component } from 'react';
import './AboutView.css';
import packageJson from '../../package.json'

class AboutView extends Component {
    render() {
        return (
            <div>
                <div id="AboutHeader">
                    <h1>ScoreMaster {packageJson.version}</h1>
                    <h4>Author: Mitch Stark</h4>
                </div>
                <p className="AboutParagraph">
                    Welcome to ScoreMaster! This site provides a one stop shop for all things EPL.
                    Whether you are just looking to keep track of your predictions in the league,
                    looking to read other's thoughts on an upcoming game, or find a spot to host
                    your blog about your favorite team or league, it can all be done here. We
                    welcome all lovers of the game, and are excited to have you here!
                </p>
                <p className="AboutParagraph">
                    If you have any feature suggestions, any games you'd like to see, or any issues, 
                    feel free to contact mitchellstark@sbcglobal.net!
                </p>
            </div>
        );
    }
}

export default AboutView;