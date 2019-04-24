import React, { Component } from 'react';
import AddNewGameForm from './AddNewGameForm';
import EditGames from './EditGames';
import './AdminView.css';

class AdminView extends Component {

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