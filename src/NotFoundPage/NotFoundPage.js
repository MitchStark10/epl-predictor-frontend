import React, { Component } from 'react';
import './NotFoundPage.css';

class NotFoundPage extends Component {
    render() {
        return (
            <div className="NotFoundPage" id="NotFoundInfo">
                <h1>Page Not Found</h1>
                <h3>The page you requested was not found. If you are looking for the main page, click <a href="/">here</a>.</h3>
            </div>
        );
    }
}

export default NotFoundPage;