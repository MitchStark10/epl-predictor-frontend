import React, { Component } from 'react';

class IndividualComment extends Component {
    render() {
        return (
            <div className="IndividualComment" id={this.props.commentData["_id"]}>
                <h4>{this.props.commentData.username}</h4>
                <p>{this.props.commentData.comment}</p>
                <p>{this.props.commentData.commentTimestamp}</p>
            </div>
        );
    }
}

export default IndividualComment;