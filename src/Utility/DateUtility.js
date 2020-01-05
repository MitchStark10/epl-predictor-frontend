class DateUtility {
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

        return monthNames[monthIndex] + ' ' + day + ', ' + year;
    }

    formatDateTime = (dateTime) => {
        let hour = dateTime.getHours() - (dateTime.getTimezoneOffset() / 60);
        let minute = dateTime.getMinutes();
        let seconds = dateTime.getSeconds();
        
        return  this.formatDate(dateTime) + ' ' + hour + ':' + minute + ':' + seconds;
    }
}

export default DateUtility;