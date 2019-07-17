import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';

class AddBlogPostView extends Component {

    constructor()  {
        super();

        this.state = {
            postTitle: "",
            postContent: "",
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
            "blogPostType": "PREDICTION"
        }

        $.post("/blog/addNewBlogPost", postData)
        .done((response) => {
            this.setState({redirectUrl: "/posts/predictions/" + this.props.gameId});
        })
        .fail((error) => {
            this.setState({errorMessage: "Unable to add new game: " + error.responseText});
        });
    }

    handleTextChange = (e) => {
        let newStateObj = {};
        newStateObj[e.target.id] = e.target.value;
        this.setState(newStateObj);
    }

    render() {
        if (this.state.redirectUrl !== "") {
            return <Redirect to={this.state.redirectUrl} />;
        }

        return (
            <div id="PostForm">
                <input type="text" id="postTitle" placeholder="Post Title" value={this.state.postTitle} onChange={this.handleTextChange} />
                <input type="text" id="postContent" placeholder="Write Blog Post Here..." value={this.state.postContent} onChange={this.handleTextChange} />
                <button id="SubmitPost" onClick={this.submitPost}>Submit</button>
            </div>
        );
    }
}

export default AddBlogPostView;