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
        return (
            <div id="BlogPost">
                <h1>{this.state.postData.PostTitle}</h1>
                <h2>Written By: {this.state.postData.Username}</h2>
                {this.state.postData.PostData}
            </div>
        );
        
    }
}

export default BlogPostView;