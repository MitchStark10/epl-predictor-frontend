import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './PostHeader.css';

class PostHeader extends Component {

    constructor(props) {
        super();

        this.state = {
            redirectUrl: ""
        }
    }
    
    redirectToPost = () => {
        this.setState({redirectUrl: "/posts/" + this.props.predictionPost["PostId"]});
    }

    render() {

        if (this.state.redirectUrl !== "") {
            this.props.history.push(this.state.redirectUrl);
            return null;
        }
        
        return (
            <div className="PostHeader" onClick={this.redirectToPost} key={this.props.predictionPost["GameId"]}>
                <h1>{this.props.predictionPost.PostTitle}</h1>
                <h4>Written By: {this.props.predictionPost.Username}</h4>
            </div>
        )
    }
}

export default withRouter(PostHeader);