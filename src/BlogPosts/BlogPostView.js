import React, { Component } from 'react';
import $ from 'jquery';
import CommentsView from './Comments/CommentsView';

class BlogPostView extends Component {

    constructor() {
        super();

        this.state = {
            postData: {},
            errorMessage: "",
            needsReRender: false,
            hasUserLikedBlogPost: false
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
                this.setState({postData: response});
            },
            (error) => {
                this.setState({errorMessage: error});
            }
        );
    }

    retrievePostLikeStatus(postId) {
        fetch("/api/blog/userBlogLikeStatus/" + postId + "/" + this.props.userToken)
        .then( response => response.json())
        .then(
            (response) => {
                if (response["userBlogLikeStatus"] === "LIKED") {
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

    componentWillReceiveProps(newProps) {
        if (newProps.postId !== this.props.postId) {
            this.retrieveBlogPostData(newProps.postId);
        }
    }

    toggleLikeBlogPost = () => {
        //TODO: Send request to the server to update the likes on this page
        $.post("/api/blog/toggleBlogLikeStatus/" + this.state.postId + "/" + this.props.userToken)
        .done((response) => {
            this.setState({hasUserLikedBlogPost: !this.state.hasUserLikedBlogPost});
        });
    }

    render() {
        let likeBlogPostLabel = "LIKE";
        if (this.state.hasUserLikedBlogPost) {
            likeBlogPostLabel = "UNLIKE";
        }

        return (
            <div id="BlogPost">
                <h1>{this.state.postData.postTitle}</h1>
                <h2>Written By: {this.state.postData.username}</h2>
                <div id="PostContent" dangerouslySetInnerHTML={{__html: this.state.postData.postData}} />
                <button id="LikeBlogPost" onClick={this.toggleLikeBlogPost}>{likeBlogPostLabel}</button>
                <CommentsView forceReload={this.toggleCommentAdded} postId={this.props.postId} userToken={this.props.userToken}/>
            </div>
        );
        
    }
}

export default BlogPostView;