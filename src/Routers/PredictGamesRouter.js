import DefaultMenu from './DefaultMenu';
import React from 'react';
import PredictGamesView from '../PredictGames/PredictGames'

class PredictGamesRouter {
    
    getUniqueIdentifier = () => {
        return "PREDICTGAMESVIEW";
    }

    render = (view, userToken) => {
        return (
            <div className={this.view}>
                <DefaultMenu />
                <PredictGamesView userToken={this.userToken} />
            </div>
        );
    }

}

export default PredictGamesRouter;