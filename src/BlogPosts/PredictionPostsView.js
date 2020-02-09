import React, { Component } from 'react';
import PostHeader from './PostHeader';
import { withRouter } from 'react-router-dom';

class PredictionPostsView extends Component {

    constructor() {
        super();

        this.state = {
            predictionPosts: [],
            needsPostsRefresh: true,
            homeTeamName: "",
            awayTeamName: "",
            errorMessage: "",
            redirectUrl: ""
        };
    } 


    componentDidMount() {
        console.log("Prediction Posts view component did mount: " + this.props.gameId);

        fetch("/public/api/blog/retrieveTeamNames/" + this.props.gameId)
        .then( result => result.json() )
        .then( (teamNames) => {
            console.log("here: " + JSON.stringify(teamNames));
            this.setState({homeTeamName: teamNames["HomeTeamName"], awayTeamName: teamNames["AwayTeamName"]});
        })

        fetch("/public/api/blog/retrieveAllBlogPostHeaders/" + this.props.postType + "/" + this.props.gameId)
        .then( result => result.json() )
        .then(
            (predictionPosts) => {
                if (predictionPosts["errorMsg"]) {
                    this.setState({errorMessage: predictionPosts["errorMsg"], needsGameRefresh: false});
                } else {
                    this.setState({predictionPosts: predictionPosts, needsPostsRefresh: false});
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
        for (let predictionPost of this.state.predictionPosts) {
            postHeaders.push(<PostHeader key={predictionPost.PostId} predictionPost={predictionPost} />);
        }

        return postHeaders;
    }

    addNewPredictionClick = () => {
        if (this.props.postType === "PREDICTION") {
            this.setState({redirectUrl: "/addPrediction/" + this.props.gameId});
        } else if (this.props.postType === "ANALYSIS") {
            this.setState({redirectUrl: "/addAnalysis/" + this.props.gameId});
        } else {
            console.error("Unknown post type: " + this.props.postType);
        }
    }

    render() {
        if (this.state.redirectUrl !== "") {
            this.props.history.push(this.state.redirectUrl);
            return null;
        }

        return (
            <div id="PredictionPostsView">
                <h1>Predictions for {this.state.homeTeamName} vs. {this.state.awayTeamName}</h1>
                <button onClick={this.addNewPredictionClick}>ADD NEW {this.props.postType}</button>
                {this.renderPredictionPostHeaders()}
            </div>
        );
        
    }
}

export default withRouter(PredictionPostsView);