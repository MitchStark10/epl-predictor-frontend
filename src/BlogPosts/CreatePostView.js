import React from 'react';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';

class CreatePostView extends React.Component {

    constructor() {
        super();

        this.state = {
            postType: "ANALYSIS",
            selectedGameId: "none",
            gameOptions: [],
            needsUpdate: true,
            redirectUrl: "",
            errorMsg: ""
        }
    }

    componentDidMount() {
        this.retrieveGameList();
    }

    componentDidUpdate() {
        this.retrieveGameList();
    }

   retrieveGameList = () => {
        if (!this.state.needsUpdate) {
            return;
        }

        let url; 
        
        if (this.state.postType === "PREDICTION") {
            url = "/api/games/retrieveAllUpcomingGames";
        } else {
            url = "/api/games/retrieveAllPastGames";
        } 

        console.log("Retrieving url: " + url);
        $.get(url)
        .done( (response) => {
            console.log(response);
            this.setState({gameOptions: response, needsUpdate: false});
        })
        .fail( (error) => {
            console.error("Encountered error retrieving all games: " + error);
            this.setState({errorMsg: error, needsUpdate: false});
        });
   }

    onPostTypeChange = (e) => {
        this.setState({postType: e.target.selectedOptions[0].id, needsUpdate: true});
    } 

    onGameChange = (e) => {
        this.setState({selectedGameId: e.target.selectedOptions[0].id});
    }


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

        return  monthNames[monthIndex] + ' ' + day +  ', ' + year;
    }

    gotoAddBlogPostView = () => {
        let url = "";
        if (this.state.postType === "PREDICTION") {
            url += "/addPrediction"
        } else {
            url += "addAnalysis"
        }

        url += "/" + this.state.selectedGameId;

        this.setState({redirectUrl: url});
    
    }

    renderNoneOption = () => {
        if (this.state.postType === "ANALYSIS") {
            return <option key="none" id="none">None</option>;
        }

        return null;
    }

    render() {
        if (this.state.redirectUrl !== "") {
            return <Redirect to={this.state.redirectUrl} />;
        }

        //TODO: the selects are ugly, fix them
        return (
            <div className="CreatePost">
                <h1>CREATE POST</h1>
                <select id="PostType" onChange={this.onPostTypeChange}>
                    <option id="ANALYSIS">ANALYSIS</option>
                    <option id="PREDICTION">PREDICTION</option>
                </select>
                <select id="PostType">
                    {this.renderNoneOption()}
                    {this.state.gameOptions.map( (game) => <option key={game._id} id={game._id}>{game.homeTeamName} VS. {game.awayTeamName} - {this.formatDate(new Date(game.gameDate))}</option>)}
                </select>
                <br />
                <button className="SmBUtton" id="CreatePost" onClick={this.gotoAddBlogPostView}>CREATE POST</button>
            </div>
        )
    }
}

export default CreatePostView;