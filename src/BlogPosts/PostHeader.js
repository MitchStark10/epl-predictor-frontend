import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './PostHeader.css';

class PostHeader extends Component {

    constructor(props) {
        super();

        this.state = {
            redirectUrl: ""
        }
    }
    
    redirectToPost = () => {
        this.setState({redirectUrl: "/posts/" + this.props.predictionPost["_id"]});
    }

    render() {

        if (this.state.redirectUrl !== "") {
            return <Redirect to={this.state.redirectUrl} />;
        }
        
        return (
            <div className="PostHeader" onClick={this.redirectToPost} key={this.props.predictionPost["_id"]}>
                <h1>{this.props.predictionPost.postTitle}</h1>
                <h4>Written By: {this.props.predictionPost.username}</h4>
            </div>
        )
    }
}

export default PostHeader;