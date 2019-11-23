import React, { Component } from 'react';
import IndividualComment from './IndividualComment';
import $ from 'jquery';
import './Comments.css';

class CommentsView extends Component {
    constructor(props) {
        super();
        this.state = {
            comments: [],
            commentText: "",
            needsCommentReload: true,
            errorMsg: ""
        };
    }

    componentDidMount() {
        this.retrieveComments();
    }

    componentDidUpdate() {
        this.retrieveComments();
    }

    retrieveComments = () => {
        if (!this.state.needsCommentReload) {
            return;
        }

        $.get("/api/comments/retrieveAllComments/" + this.props.postId)
            .done((response) => {
                console.log("Received response: " + response);
                this.setState({comments: response, needsCommentReload: false});
            })
            .fail((error) => {
                console.error("Received error: " + error);
                this.setState({ errorMsg: error["errorMsg"] });
            });
    }

    handleTextChange = (e) => {
        let newStateObj = {};
        newStateObj[e.target.id] = e.target.value;
        this.setState(newStateObj);
    }

    addNewComment = () => {
        const commentToAdd = {
            username: this.props.userToken,
            postId: this.props.postId,
            commentText: this.state.commentText
        };

        $.post("/api/comments/addComment", commentToAdd)
        .done( (response) => {
            this.setState({commentText: "", needsCommentReload: true});
        })
        .fail( (error) => {
            console.error(error);
            this.setState({errorMsg: error["errorMsg"]});
        });
    }

    renderComments = () => {
        if (this.state.comments.length === 0) {
            return null;
        }

        const commentsList = [];

        for (let comment of this.state.comments) {
            commentsList.push(<IndividualComment commentData={comment} />);
        }

        return commentsList;
    }

    render() {
        return (
            <div id="CommentsView">
                <h2>Comments</h2>
                {this.renderComments()}
                <textarea type="text" id="commentText" placeholder="Comment on this post..." value={this.state.commentText} onChange={this.handleTextChange} /><br />
                <button id="AddNewCommentButton" onClick={this.addNewComment}>Add New Comment</button>
            </div>
        );
    }
}

export default CommentsView;