import DefaultMenu from './MenuRouter';
import React from 'react';
import PredictGamesView from '../PredictGames/PredictGames'

class PredictGamesRouter {
    
    getUniqueIdentifier = () => {
        return "PREDICTGAMESVIEW";
    }

    render = (userToken) => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <DefaultMenu />
                <PredictGamesView userToken={userToken} />
            </div>
        );
    }

}

export default PredictGamesRouter;