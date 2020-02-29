import DefaultMenu from './MenuRouter';
import React from 'react';
import PredictGamesView from '../PredictGames/PredictGames'

class PredictGamesRouter {
    
    getUniqueIdentifier = () => {
        return "PREDICTGAMESVIEW";
    }

    userRequiresLogin = (userToken) => {
        return !userToken || userToken === ""; 
    }

    render = (userToken) => {
        

        return (
            <div className={this.getUniqueIdentifier()}>
                <DefaultMenu userToken={userToken}/>
                <PredictGamesView userToken={userToken} />
            </div>
        );
    }

}

export default PredictGamesRouter;