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
        this.setState({redirectUrl: "/posts/" + this.props.predictionPost.PostId});
    }

    render() {

        if (this.state.redirectUrl !== "") {
            return <Redirect to={this.state.redirectUrl} />;
        }

        console.log(JSON.stringify(this.props));
        return (
            <div className="PostHeader" onClick={this.redirectToPost} key={this.props.predictionPost.PostId}>
                <h1>{this.props.predictionPost.PostTitle}</h1>
                <h4>Written By: {this.props.predictionPost.Username}</h4>
            </div>
        )
    }
}

export default PostHeader;