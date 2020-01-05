import MenuRouter from './MenuRouter';

class LeaderboardsRouter {

    getUniquerIdentifier = () => {
        return "LEADERBOARDSVIEW";
    }

    render = () => {
        return (
            <div className={this.props.view}>
                <MenuRouter />
                <LeaderboardsView />
            </div>
        );
    }
}

export default LeaderboardsRouter;