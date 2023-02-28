import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Progress, Alert } from 'reactstrap';
import { withRouter, useParams, useRouteMatch, matchPath } from 'react-router-dom';
import { dismissAlert } from '../../actions/alerts';
import s from './Sidebar.module.scss';
import LinksGroup from './LinksGroup/LinksGroup';
import { openSidebar, closeSidebar, changeActiveSidebarItem } from '../../actions/navigation';
import isScreen from '../../core/screenHelper';
import { logoutUser } from '../../actions/auth';
// const activeSite = this.props;


class Sidebar extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    activeItem: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    sidebarStatic: false,
    sidebarOpened: false,
    activeItem: '',
  };

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.doLogout = this.doLogout.bind(this);

      this.state = {
	  userType: ""
      }
  }

  onMouseEnter() {
    if (!this.props.sidebarStatic && (isScreen('lg') || isScreen('xl'))) {
      const paths = this.props.location.pathname.split('/');
      paths.pop();
      this.props.dispatch(openSidebar());
      this.props.dispatch(changeActiveSidebarItem(paths.join('/')));
    }
  }

  onMouseLeave() {
    if (!this.props.sidebarStatic && (isScreen('lg') || isScreen('xl'))) {
      this.props.dispatch(closeSidebar());
      this.props.dispatch(changeActiveSidebarItem(null));
    }
  }

  dismissAlert(id) {
    this.props.dispatch(dismissAlert(id));
  }

  doLogout() {
    this.props.dispatch(logoutUser());
  }

    render() {
        const { location } = this.props;
        const sitesLinkObj = {}
        const pathMatch = matchPath(location.pathname, {
           path: '/app/main/sites/:site_id',
           exact: false,
           strict: true
        })
        let isMatch = false;
        if(pathMatch) {
            const { site_id } = pathMatch.params
            if(!site_id || (typeof site_id !== 'string' && (typeof site_id !== 'object' || Array.isArray(site_id) || typeof site_id.toString !== 'function'))) return false;
            // check if site_id is a valid Mongodb object ID
            isMatch =  /^[0-9A-F]{24}$/i.test(site_id.toString());
        }
	
        return (
            
            <div className={`${(!this.props.sidebarOpened && !this.props.sidebarStatic) ? s.sidebarClose : ''} ${s.sidebarWrapper}`}>
                <nav
                    onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
                    className={s.root}
                >
                    <header className={s.logo}>
                        <a href="/">{/*<img src="https://dealermasters.com/img/logo-dm.png"/>*/}<span className={s.logoStyle}>TB</span></a>
                    </header>
                    <ul className={s.nav}>
                        
                        <LinksGroup
                            onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                            activeItem={this.props.activeItem}
                            header="Templates"
                            isHeader
                            iconName="flaticon-file-1"
                            link="/app/main"
                            index="main"
                            exact={true}
                            childrenLinks={[
                                {
                                    header: 'Create Templates', link: '/app/main/templates/create', exact: true
                                },
                                {
                                    header: 'Build Template', link: '/app/main/templates/build',
                                },
                                {
                                    header: 'View Templates', link: '/app/main/templates',
                                }
                            ]}
                        />

                        <LinksGroup
                            onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                            activeItem={this.props.activeItem}
                            header="Dealers"
                            isHeader
                            iconName="flaticon-briefcase"
                            link="/app/main"
                            index="main"
                            exact={true}
                            childrenLinks={[
                                {
                                    header: 'Create Dealers', link: '/app/main/dealers/create', exact: true
                                },
                                {
                                    header: 'View Dealers', link: '/app/main/dealers',
                                }
                            ]}
                        />

                        <LinksGroup
                            onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                            activeItem={this.props.activeItem}
                            header="Variables"
                            isHeader
                            iconName="flaticon-settings-4"
                            link="/app/main"
                            index="main"
                            exact={true}
                            childrenLinks={[
                                {
                                    header: 'Create Variables', link: '/app/main/sites', exact: true
                                },
                                {
                                    header: 'View Variables', link: '/app/main/variables',
                                }
                            ]}
                        />

                        <LinksGroup
                            onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                            activeItem={this.props.activeItem}
                            header="Go Back to DM"
                            isHeader
                            iconName="flaticon-home"
                            link="/app/main"
                            index="main"
                            exact={true}
                        />

                    </ul>
                </nav >
            </div>
        );
    }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    alertsList: store.alerts.alertsList,
    activeItem: store.navigation.activeItem,
    navbarType: store.navigation.navbarType,
    sidebarColor: store.layout.sidebarColor,
  };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
