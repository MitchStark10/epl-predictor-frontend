import React, { Component } from 'react';

class PredictionPostsView extends Component{

    render() {
        return (
            <div id="PredictionPostsView">
                <h1>Predictions for game {this.props.gameId}</h1>
            </div>
        );
        
    }
}

export default PredictionPostsView;