import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  Navbar,
  Nav,
  Dropdown,
  NavItem,
  NavLink,
  Badge,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
  InputGroupAddon,
  InputGroup,
  Input,
  Form,
  FormGroup,
} from 'reactstrap';
import cx from 'classnames';
import { NavbarTypes } from '../../reducers/layout';
import Notifications from '../Notifications';
import { logoutUser } from '../../actions/auth';
import chroma from 'chroma-js'
import Joyride, { STATUS } from 'react-joyride';
import { toggleSidebar, openSidebar, closeSidebar, changeActiveSidebarItem } from '../../actions/navigation';

import adminDefault from '../../images/chat/chat2.png';

import s from './Header.module.scss'; // eslint-disable-line css-modules/no-unused-class

class Header extends React.Component {
  static propTypes = {
    sidebarOpened: PropTypes.bool.isRequired,
    sidebarStatic: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.switchSidebar = this.switchSidebar.bind(this);
    this.toggleNotifications = this.toggleNotifications.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.doLogout = this.doLogout.bind(this);

    this.state = {
      theUser: localStorage.getItem('user-data'),
      menuOpen: false,
      notificationsOpen: false,
      notificationsTabSelected: 1,
      focus: false,
      showNewMessage: false,
      hideMessage: true,
      run: false,
      steps: [
        {
          content: 'You can adjust sidebar, or leave it closed 😃',
          placement: 'bottom',
          target: '#toggleSidebar',
          textAlign: 'center',
          disableBeacon: true
        },
        {
          content: "Admin can check out his messages and tasks easily 😃",
          placement: 'bottom',
          target: '.dropdown-toggle',
        },
        {
          content: "Clickable cog can provide you with link to important pages 😄",
          placement: 'bottom',
          target: '.tutorial-dropdown',
        },
        {
          content: 'Open theme cusomizer sidebar, play with it or watch tour! ❤️',
          placement: 'left',
          target: '.helper-button'
        },
      ],
    };
  }

  componentDidMount() {
    if (window.location.href.includes('main')) {
      this.setState({ run: true })
    }
  }

  handleJoyrideCallback = (CallBackProps) => {
    const { status } = CallBackProps;

    if (([STATUS.FINISHED, STATUS.SKIPPED]).includes(status)) {
      this.setState({ run: false });
    }

  };

  start = () => {
    this.setState({
      run: true,
    });
  };

  toggleFocus = () => {
    this.setState({ focus: !this.state.focus })
  }

  toggleNotifications() {
    this.setState({
      notificationsOpen: !this.state.notificationsOpen,
    });
  }

  doLogout() {
    this.props.dispatch(logoutUser());
  }

  // collapse/uncolappse
  switchSidebar() {
    if (this.props.sidebarOpened) {
      this.props.dispatch(closeSidebar());
      this.props.dispatch(changeActiveSidebarItem(null));
    } else {
      const paths = this.props.location.pathname.split('/');
      paths.pop();
      this.props.dispatch(openSidebar());
      this.props.dispatch(changeActiveSidebarItem(paths.join('/')));
    }
  }

  // static/non-static
  toggleSidebar() {
    this.props.dispatch(toggleSidebar());
    if (this.props.sidebarStatic) {
      localStorage.setItem('staticSidebar', 'false');
      this.props.dispatch(changeActiveSidebarItem(null));
    } else {
      localStorage.setItem('staticSidebar', 'true');
      const paths = this.props.location.pathname.split('/');
      paths.pop();
      this.props.dispatch(changeActiveSidebarItem(paths.join('/')));
    }
  }

  toggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  }
  render() {
    const { focus } = this.state;
    const { navbarType, navbarColor, openUsersList } = this.props;

    const user = this.props.currentUser;
    const avatar = user && user.avatar && user.avatar.length && user.avatar[0].publicUrl;

    const firstUserLetter = user && (user.firstName|| user.email)[0].toUpperCase();

    return (
      <Navbar className={`${s.root} d-print-none ${navbarType === NavbarTypes.FLOATING ? s.navbarFloatingType : ''}`} style={{backgroundColor: navbarColor, zIndex: !openUsersList ? 100 : 0}}>
        <Joyride
          callback={this.handleJoyrideCallback}
          continuous={true}
          run={this.state.run}
          showSkipButton={true}
          steps={this.state.steps}
          spotlightPadding={-10}
          disableOverlay={true}
          disableScrolling
          styles={{
            options: {
              arrowColor: '#ffffff',
              backgroundColor: '#ffffff',
              overlayColor: 'rgba(79, 26, 0, 0.4)',
              primaryColor: '#000',
              textColor: '#495057',
              spotlightPadding: 0,
              zIndex: 1000,
              padding: 5,
              width: 240,
            },
            tooltip: {
              fontSize: 15,
              padding: 15,
            },
            tooltipContent: {
              padding: '20px 5px 0',
            },
            floater: {
              arrow: {
                padding: 10
              },
            },
            buttonClose: {
              display: 'none'
            },
            buttonNext: {
              backgroundColor: "#21AE8C",
              fontSize: 13,
              borderRadius: 4,
              color: "#ffffff",
              fontWeight: "bold",
              outline: "none"
            },
            buttonBack: {
              color: "#798892",
              marginLeft: 'auto',
              fontSize: 13,
              marginRight: 5,
            },
            buttonSkip: {
              color: "#798892",
              fontSize: 13,
            },
          }}
        />

        <NavLink className={`${s.navbarBrand} d-md-none ${chroma(navbarColor).luminance() < 0.4 ? "text-white" : ""}`}>
          <i className="fa fa-circle text-primary mr-n-sm" />
          <i className="fa fa-circle text-danger" />
          &nbsp;
          Dealer Masters
          &nbsp;
          <i className="fa fa-circle text-danger mr-n-sm" />
          <i className="fa fa-circle text-primary" />
        </NavLink>

        <Nav className="ml-auto">
          <Dropdown nav isOpen={this.state.notificationsOpen} toggle={this.toggleNotifications} id="basic-nav-dropdown" className={`${s.notificationsMenu}`}>
            <DropdownToggle nav>          
              <span className={`small d-sm-down-none ${this.props.sidebarStatic ? s.adminEmail : ''} ${chroma(navbarColor).luminance() < 0.4 ? "text-white" : ""}`}>{this.state.theUser ? (this.state.theUser.nickname || this.state.theUser.name) : "Philip smith"}</span>
            </DropdownToggle>
          </Dropdown>
          <Dropdown nav isOpen={this.state.menuOpen} toggle={this.toggleMenu} className="tutorial-dropdown pr-4">
            <DropdownToggle nav className={`${s.mobileCog}`}>
             <i className={`fa fa-cog ${chroma(navbarColor).luminance() < 0.4 ? "text-white" : ""}`} />
            </DropdownToggle>
            <DropdownMenu right className={`super-colors`}>
              <DropdownItem onClick={this.doLogout}><i className="la la-sign-out" /> Log Out</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </Navbar>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    navbarType: store.layout.navbarType,
    navbarColor: store.layout.navbarColor,
    openUsersList: store.chat.openUsersList,
    currentUser: store.auth.currentUser,
  };
}

export default withRouter(connect(mapStateToProps)(Header));

