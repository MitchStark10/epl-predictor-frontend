import React, { Component } from 'react';
import './MainMenu.css'

class MainMenu extends Component {

    handleButtonClick = (event) => {
        console.log("Clicked Main Menu Button: " + event.target.id);
        this.props.changeToView(event.target.id);
    }

    render() {
        return (
            <div className="Main-Menu-Buttons">
                <button className="Main-Menu" id="ALLGAMESVIEW" onClick={this.handleButtonClick}>Game Predictions</button>
                <button className="Main-Menu" id="BLOGVIEW" onClick={this.handleButtonClick}>Blog</button>
                <button className="Main-Menu" id="ABOUTVIEW" onClick={this.handleButtonClick}>About</button>
            </div>
        );
    }
}

export default MainMenu;