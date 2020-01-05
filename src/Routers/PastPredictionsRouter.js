import MenuRouter from "./MenuRouter";


class PastPredictionsRouter {

    getUniqueIdentifier = () => {
        return "PASTPREDICTIONSVIEW";
    }

    render = (userToken) => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter />
                <PreviousPredictionsView userToken={userToken} />
            </div>
        );
    }
}

export default PastPredictionsRouter;