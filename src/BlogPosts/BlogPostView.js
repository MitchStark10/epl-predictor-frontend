import React, { Component } from 'react';
import $ from 'jquery';
import CommentsView from './Comments/CommentsView';

class BlogPostView extends Component {

    constructor() {
        super();

        this.state = {
            postData: {},
            errorMessage: '',
            needsReRender: false,
            numLikes: 0,
            hasUserLikedBlogPost: false
        };
    }

    componentDidMount() {
        this.retrieveBlogPostData(this.props.postId);
        this.retrieveBlogPostData();
        // TODO: Retrieve blog post likes
    }

    retrieveBlogPostData(postId) {
        fetch('/public/api/blog/retrieveBlogPost/' + postId)
            .then( response => response.json())
            .then(
                (response) => {
                    this.setState({postData: response});
                },
                (error) => {
                    this.setState({errorMessage: error});
                }
            );
    }

    retrievePostLikeStatus(postId) {
        fetch('/public/api/blog/userBlogLikeStatus/' + postId + '/' + this.props.userToken)
            .then( response => response.json())
            .then(
                (response) => {
                    if (response['userBlogLikeStatus'] === 'LIKED') {
                        this.setState({ hasUserLikedBlogPost: true});
                    } else {
                        this.setState({ hasUserLikedBlogPost: false});
                    }
                },
                (error) => {
                    this.setState({errorMessage: error});
                }
            );
    }

    toggleLikeBlogPost = () => {
        $.post('/public/api/blog/toggleBlogLikeStatus/' + this.state.postId + '/' + this.props.userToken)
            .done(() => {
                this.setState({hasUserLikedBlogPost: !this.state.hasUserLikedBlogPost});
            });
    }

    render() {
        let likeBlogPostLabel = 'LIKE';
        if (this.state.hasUserLikedBlogPost) {
            likeBlogPostLabel = 'UNLIKE';
        }

        return (
            <div id="BlogPost">
                <h1>{this.state.postData.PostTitle}</h1>
                <h2>Written By: {this.state.postData.Username}</h2>
                <div id="PostContent" dangerouslySetInnerHTML={{__html: this.state.postData.PostData}} />
                <button id="LikeBlogPost" onClick={this.toggleLikeBlogPost}>{likeBlogPostLabel}</button>
                <p>Likes: {this.state.numLikes}</p>
                <CommentsView forceReload={this.toggleCommentAdded} postId={this.props.postId} userToken={this.props.userToken}/>
            </div>
        );

    }
}

export default BlogPostView;
