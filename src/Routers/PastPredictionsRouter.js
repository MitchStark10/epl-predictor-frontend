import React from 'react';
import MenuRouter from "./MenuRouter";
import PreviousPredictionsView from '../PastPredictions/PastPredictionsView';


class PastPredictionsRouter {

    getUniqueIdentifier = () => {
        return "PASTPREDICTIONSVIEW";
    }

    render = (userToken) => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter userToken={userToken}/>
                <PreviousPredictionsView userToken={userToken} />
            </div>
        );
    }
}

export default PastPredictionsRouter;