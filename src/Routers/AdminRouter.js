import MenuRouter from './MenuRouter';

class AdminRouter {

    getUniqueIdentifier = () => {
        return "ADMINVIEW";
    }

    render = () => {
        return (
            <div className={this.getUniqueIdentifier()}>
                <MenuRouter />
                <AdminView />
            </div>
        );
    }
}

export default AdminRouter;