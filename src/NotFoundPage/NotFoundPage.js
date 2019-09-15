import React, { Component } from 'react';

class NotFoundPage extends Component {
    render() {
        return (
            <div id="NotFoundInfo">
                <h1>Page Not Found</h1>
                <h3>The page you requested was not found. If you are looking for the main page, click <a href="/">here</a>.</h3>
            </div>
        );
    }
}

export default NotFoundPage;