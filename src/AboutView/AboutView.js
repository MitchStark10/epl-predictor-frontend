import React, { Component } from 'react';
import './AboutView.css';

class AboutView extends Component {
    render() {
        return (
            <div>
                <h1>About ScoreMaster</h1>
                <h4>Version: 1.3.4</h4>
                <h4>Author: Mitch Stark</h4>
                <p className="AboutParagraph">
                    Welcome to ScoreMaster! This web app was created to help keep track of 
                    soccer predictions, and to create a little bit of competition amongst those who do it. 
                    A "seasons" challengewill soon be added to provide incentive to rise your way to the 
                    top of the ranks! Each season will consist of a handful of games from the EPL, 
                    Champions League, and MLS chosen of the course of the month. The winner is chosen 
                    by having the highest numberof correct predictions throughout the month. 
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