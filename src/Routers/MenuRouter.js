import React from 'react';
import MobileHeaderMenu from '../AppHeader/Mobile/MobileHeaderMenu';
import DesktopHeaderMenu from '../AppHeader/Desktop/DesktopHeaderMenu';

class MenuRouter extends React.Component {
    constructor() {
        super();

        this.minimumDesktopPixelWidth = 1050;
        this.minimumDesktopPixelWidthToDisplayFullHeader = 1260;

        this.state = {
            displayLoggedInUser: false,
            useMobileMenu: true
        };
    }

	componentDidMount = () => {
	    window.addEventListener('resize', this.resize.bind(this));
	    this.resize();
	}

	resize = () => {
	    this.setState({
	        useMobileMenu: window.innerWidth <= this.minimumDesktopPixelWidth,
	        displayLoggedInUser: window.innerWidth >= this.minimumDesktopPixelWidthToDisplayFullHeader
	    });
	}

	render() {
	    if (this.state.useMobileMenu) {
	        return <MobileHeaderMenu userToken={this.props.userToken} />;
	    }

	    return <DesktopHeaderMenu
	        userToken={this.props.userToken}
	        showLoggedInUser={this.state.displayLoggedInUser}
	    />;
	}
}

export default MenuRouter;