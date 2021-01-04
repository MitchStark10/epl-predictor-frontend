import React, { Component } from 'react';
import './AboutView.css';
import packageJson from '../../package.json';

class AboutView extends Component {
    render() {
        return (
            <div>
                <div id="AboutHeader">
                    <h1>ScoreMaster {packageJson.version}</h1>
                    <h4>Author: Mitch Stark</h4>
                </div>
                <p className="AboutParagraph">
                    Welcome to ScoreMaster! This site provides a fun way to compete and interact with other MLS fans around the globe. You will have the opportuntity to prove your knowledge around MLS and have an opportunity to win prizes while doing so. Enjoy!
                </p>
                <p className="AboutParagraph">
                    If you have any feature suggestions, any games you&apos;d like to see, or any issues,
                    feel free to contact MitchStark10@gmail.com!
                </p>
            </div>
        );
    }
}

export default AboutView;
