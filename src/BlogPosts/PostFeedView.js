import React from 'react';
import $ from 'jquery';
import PostHeader from './PostHeader';

class PostFeedView extends React.Component {
    
    constructor() {
        super();

        this.state = {
            blogPostHeaders: [],
            errorMsg: ""
        }
    }
    
    componentDidMount() {
        $.get("/api/blog/retrieveAllBlogPostHeaders")
        .done( (response) => {
            console.log(response)
            this.setState({blogPostHeaders: response});
        })
        .fail( (error) => {
            console.error(error);
            this.setState({errorMsg: error});
        })
    }

    render() {
        return (
            <div id="PostFeed">
                <h1>Posts</h1>
                {this.state.blogPostHeaders.map( (header) => <PostHeader predictionPost={header} /> )}
            </div>
        );
    }
}

export default PostFeedView;