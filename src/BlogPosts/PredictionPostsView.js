import React, { Component } from 'react';
import PostHeader from './PostHeader';
import { Redirect } from 'react-router-dom';

class PredictionPostsView extends Component {

    constructor() {
        super();

        this.state = {
            predictionPosts: [],
            needsPostsRefresh: true,
            errorMessage: "",
            redirectUrl: ""
        };
    } 


    componentDidMount() {
        console.log("Prediction Posts view component did mount: " + this.props.gameId);

        fetch("/retrieveAllBlogPostHeaders/PREDICTION/" + this.props.gameId)
        .then( result => result.json() )
        .then(
            (predictionPosts) => {
                if (predictionPosts["errorMsg"]) {
                    this.setState({errorMessage: predictionPosts["errorMsg"], needsGameRefresh: false});
                } else {
                    this.setState({predictinPosts: predictionPosts, needsPostsRefresh: false});
                }
            },
            (error) => {
                console.log("Error retrieving games: " + error);
            }
        );

        console.log("Exiting prediction post view compoment mounting")
    }

    renderPredictionPostHeaders = () => {
        let postHeaders = [];

        for (let predictionPost in this.state.predictionPosts) {
            postHeaders.push(<PostHeader predictionPost={predictionPost} />);
        }

        return postHeaders;
    }

    addNewPredictionClick = () => {
        this.setState({redirectUrl: "/addPrediction/" + this.props.gameId});
    }

    render() {
        if (this.state.redirectUrl !== "") {
            return (
                <Redirect to={this.state.redirectUrl} />
            );
        }

        return (
            <div id="PredictionPostsView">
                <h1>Predictions for game {this.props.gameId}</h1>
                {this.renderPredictionPostHeaders()}
                <button onClick={this.addNewPredictionClick}>Add New Prediction</button>
            </div>
        );
        
    }
}

export default PredictionPostsView;