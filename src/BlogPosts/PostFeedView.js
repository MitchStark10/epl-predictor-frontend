import React from 'react';
import $ from 'jquery';
import PostHeader from './PostHeader';

class PostFeedView extends React.Component {

    constructor() {
        super();

        this.state = {
            blogPostHeaders: [],
            errorMsg: ''
        };
    }

    componentDidMount() {
        $.get('/public/api/blog/retrieveAllBlogPostHeaders')
            .done( (response) => {
                this.setState({blogPostHeaders: response});
            })
            .fail( (error) => {
                console.error(error);
                this.setState({errorMsg: error});
            });
    }

    render() {
        return (
            <div id="PostFeed">
                <h1>Posts</h1>
                {this.state.blogPostHeaders.map( (header) => <PostHeader key={header['PostId']} predictionPost={header} /> )}
            </div>
        );
    }
}

export default PostFeedView;
