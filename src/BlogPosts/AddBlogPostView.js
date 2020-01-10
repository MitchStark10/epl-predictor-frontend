import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';
import './BlogPostView.css';

class AddBlogPostView extends Component {

    constructor()  {
        super();

        this.state = {
            postTitle: "",
            postContent: "",
            viewType: "ADD_CONTENT",
            errorMessage: "",
            redirectUrl: ""
        };
    }

    submitPost = () => {
        let postData = {            
            "blogPostTitle": this.state.postTitle,
            "blogPostData": this.state.postContent,
            "username": this.props.userToken,
            "gameId": this.props.gameId,
            "blogPostType": this.props.postType
        }

        $.post("/api/blog/addNewBlogPost", postData)
        .done((response) => {
            if (this.props.postType === "PREDICTION") {
                this.setState({redirectUrl: "/posts/predictions/" + this.props.gameId, errorMessage: ""});
            } else if (this.props.postType === "ANALYSIS") {
                if (this.props.gameId !== "none") {
                    this.setState({ redirectUrl: "/posts/analysis/" + this.props.gameId, errorMessage: "" });
                } else {
                    this.setState({ redirectUrl: "/recentPosts", errorMsg: "" });
                }
            } else {
                console.error("Unknown post type: " + this.props.postType);
                this.setState({errorMessage: "Unknown post type: " + this.props.postType});
            }
        })
        .fail((error) => {
            console.log("Unalbe to add new game: " + error.responseJSON.errorMsg);
            this.setState({errorMessage: "Unable to add new game: " + error.responseJSON.errorMsg});
        });
    }

    toggleViewType = () => {
        if (this.state.viewType === "ADD_CONTENT") {
            this.setState({viewType: "RENDER"});
        } else {
            this.setState({viewType: "ADD_CONTENT"});
        }
    }

    handleTextChange = (e) => {
        let newStateObj = {};
        newStateObj[e.target.id] = e.target.value;
        this.setState(newStateObj);
    }

    renderPostContent = () => {
        return (
            <div id="RenderView">
                <div id="RenderedPostTitle">
                    <h1>{this.state.postTitle}</h1>
                </div>
                <div id="RenderedPostContent" dangerouslySetInnerHTML={{ __html: this.state.postContent }} />
            </div>
       )
    }

    render() {
        if (this.state.redirectUrl !== "") {
            this.props.history.push(this.state.redirectUrl);
            return null;
        }

        if (this.state.viewType === "RENDER") {
            return (
                <div id="PostForm">
                    {this.renderPostContent()}
                    <button id="SubmitPost" onClick={this.submitPost}>SUBMIT</button>
                    <button id="ToggleViewType" onClick={this.toggleViewType}>EDIT</button>
                    <h1 id="ErrorMessage">{this.state.errorMessage}</h1>
                </div>
            );
        }

        return (
            <div id="PostForm">
                <input type="text" id="postTitle" placeholder="Post Title" value={this.state.postTitle} onChange={this.handleTextChange} />
                <textarea type="text" id="postContent" placeholder="Write Blog Post Here..." value={this.state.postContent} onChange={this.handleTextChange} /><br />
                <button id="SubmitPost" onClick={this.submitPost}>SUBMIT</button>
                <button id="ToggleViewType" onClick={this.toggleViewType}>RENDER</button>
                <h1 id="ErrorMessage">{this.state.errorMessage}</h1>
            </div>
        );
    }
}

export default withRouter(AddBlogPostView);