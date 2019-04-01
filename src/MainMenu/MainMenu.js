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
                <button className="Main-Menu" id="PASTPREDICTIONSVIEW" onClick={this.handleButtonClick}>View Past Predictions</button>
                <button className="Main-Menu" id="PREDICTGAMESVIEW" onClick={this.handleButtonClick}>Predict Games</button>
                <button className="Main-Menu" id="ADMINVIEW" onClick={this.handleButtonClick}>Admin</button>
                <button className="Main-Menu" id="ABOUTVIEW" onClick={this.handleButtonClick}>About</button>
            </div>
        );
    }
}

export default MainMenu;