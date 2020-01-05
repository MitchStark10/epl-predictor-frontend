import MenuRouter from './MenuRouter';

class AboutRouter {

    getUniqueIdentifier = () => {
        return "ABOUTVIEW";
    }

    render = () => {
        return (
            <div className={this.props.view}>
                <MenuRouter />
                <AboutView />
            </div>
        );
    }
}

export default AboutRouter;