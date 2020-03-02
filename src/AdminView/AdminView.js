import React, { Component } from 'react';
import AddNewGameForm from './AddNewGameForm';
import EditGames from './EditGames';
import './AdminView.css';

class AdminView extends Component {
    
    componentDidMount() {
        if (this.isUserLoggedIn()) {
            this.forwardToLoginPage();
        }
    }

    isUserLoggedIn() {
        return this.props.userToken && this.props.userToken !== "";
    }

    forwardToLoginPage() {
        this.props.history.push('/login');
    }

    //TODO: Check that the user is not only logged in, but also has the correct role
    render() {
        return (
            <div id="AdminView">
                <h1>Add New Games</h1>
                <AddNewGameForm />
                <h1>Edit Existing Games</h1>
                <EditGames />
            </div>
        );
    }
}

export default AdminView;