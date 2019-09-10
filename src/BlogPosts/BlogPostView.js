import React, { Component } from 'react';

class BlogPostView extends Component {

    constructor() {
        super();

        this.state = {
            postData: {},
            errorMessage: ""
        };
    }

    componentDidMount() {
        this.retrieveBlogPostData(this.props.postId);
    }

    retrieveBlogPostData(postId) {
        fetch("/api/blog/retrieveBlogPost/" + postId)
        .then( response => response.json())
        .then( 
            (response) => {
                console.log(JSON.stringify(response));
                this.setState({postData: response});
            },
            (error) => {
                this.setState({errorMessage: error});
            }
        );
    }

    componentWillReceiveProps(newProps) {
        if (newProps.postId !== this.props.postId) {
            this.retrieveBlogPostData(newProps.postId);
        }
    }

    render() {
        console.log('test: ' + JSON.stringify(this.state));
        return (
            <div id="BlogPost">
                <h1>{this.state.postData.postTitle}</h1>
                <h2>Written By: {this.state.postData.username}</h2>
                {this.state.postData.postData}
            </div>
        );
        
    }
}

export default BlogPostView;