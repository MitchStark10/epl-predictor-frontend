import React, { Component } from 'react';
import './Comments.css';

class IndividualComment extends Component {

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
        let hour = date.getHours();
        let minute = date.getMinutes();
        let seconds = date.getSeconds();

        return  monthNames[monthIndex] + ' ' + day +  ', ' + year + ' ' + hour + ':' + minute + ':' + seconds;
    }

    render() {
        const formattedDate = this.formatDate(new Date(this.props.commentData.commentTimestamp));
        return (
            <div className="IndividualComment" id={this.props.commentData["_id"]}>
                <p>{this.props.commentData.comment}</p>
                <p>{this.props.commentData.username}</p>
                <p>{formattedDate}</p>
            </div>
        );
    }
}

export default IndividualComment;