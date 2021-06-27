import React, { Component } from 'react';
import './Comments.css';
import DateUtility from '../../Utility/DateUtility';

class IndividualComment extends Component {

    render() {
        const formattedDate = new DateUtility().formatDate(new Date(this.props.commentData.CommentTime));
        return (
            <div className="IndividualComment" id={this.props.commentData['CommentId']}>
                <p>{this.props.commentData.CommentText}</p>
                <p>{this.props.commentData.Username}</p>
                <p>{formattedDate}</p>
            </div>
        );
    }
}

export default IndividualComment;