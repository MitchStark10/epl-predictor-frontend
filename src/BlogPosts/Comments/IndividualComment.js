import React, { Component } from 'react';
import './Comments.css';

class IndividualComment extends Component {

    //TODO: Create a frontend utility class for this method, it's being used in multiple spots
    formatDate = (date) => {
        let monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        let day = date.getDate();
        let monthIndex = date.getMonth();
        let year = date.getFullYear();
        let hour = date.getHours() - (date.getTimezoneOffset() / 60);
        let minute = date.getMinutes();
        let seconds = date.getSeconds();
        
        return  monthNames[monthIndex] + ' ' + day +  ', ' + year + ' ' + hour + ':' + minute + ':' + seconds;
    }

    render() {
        const formattedDate = this.formatDate(new Date(this.props.commentData.CommentTime));
        return (
            <div className="IndividualComment" id={this.props.commentData["CommentId"]}>
                <p>{this.props.commentData.CommentText}</p>
                <p>{this.props.commentData.Username}</p>
                <p>{formattedDate}</p>
            </div>
        );
    }
}

export default IndividualComment;