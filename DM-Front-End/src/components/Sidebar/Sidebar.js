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
	if (JSON.parse(localStorage.getItem('user-data')).dm_user_type == 'omni') {
        return (
            
            <div className={`${(!this.props.sidebarOpened && !this.props.sidebarStatic) ? s.sidebarClose : ''} ${s.sidebarWrapper}`}>
                <nav
                    onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
                    className={s.root}
                >
                    <header className={s.logo}>
                        <a href="/">{/*<img src="https://dealermasters.com/img/logo-dm.png"/>*/}<span className={s.logoStyle}>DM</span></a>
                    </header>
                    <ul className={s.nav}>
                        
                        <LinksGroup
                            onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                            activeItem={this.props.activeItem}
                            header="Dashboard"
                            isHeader
                            iconName="flaticon-home"
                            link="/app/main"
                            index="main"
                            exact={true}
                            childrenLinks={[
                                {
                                    header: 'Sites', link: '/app/main/sites', exact: true
                                },
                                {
                                    header: 'Create Site', link: '/app/main/sites/create',
                                }
                            ]}
                />
                 {isMatch ?  (
                        
                        <LinksGroup
                            onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                            activeItem={this.props.activeItem}
                            header="Site"
                            isHeader
                            iconName="flaticon-cloud"
                            link={`/app/main/sites/${pathMatch.params.site_id}`}
                            index={`site`}
                            exact={true}
                            childrenLinks={[
                                {
                                    header: 'Welcome', link: `/app/main/sites/${pathMatch.params.site_id}/landing`,
                                },
                                {
                                    header: 'Admin', link: `/app/main/sites/${pathMatch.params.site_id}/admin`,
                                },
                                {
                                    header: 'Pages', link: `/app/main/sites/${pathMatch.params.site_id}/pages`,
                                },
                                {
                                    header: 'Settings', link: `/app/main/sites/${pathMatch.params.site_id}/settings`,
                                },
                                {
                                    header: 'Navigation', link: `/app/main/sites/${pathMatch.params.site_id}/navigation`,
                                },
                                {
                                    header: 'Inventory', link: `/app/main/sites/${pathMatch.params.site_id}/inventory`
                                },
                                {
                                    header: 'Analytics', link: `/app/main/sites/${pathMatch.params.site_id}/analytics`,
                                }
                            ]}
                        />
                        ) : ''}
                        {isMatch ?  (
                        <>
                            <LinksGroup
                                onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                                activeItem={this.props.activeItem}
                                header="Rules"
                                isHeader
                                iconName="flaticon-notebook"
                                link={`/app/main/sites/${pathMatch.params.site_id}/`}
                                index={`site`}
                                exact={true}
                                childrenLinks={[
                                    {
                                        header: 'Inventory Rules', link: `/app/main/sites/${pathMatch.params.site_id}/rules`,
                                    }
                                ]}
                            />
                        </>
                        ) : ''}
			<LinksGroup
                            onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                            activeItem={this.props.activeItem}
                            header="User Management"
                            isHeader
                            iconName="flaticon-user"
                            link="/admin"
                            index="admin"
                            exact={false}
                            childrenLinks={[
                                {
                                    header: 'Users', link: '/admin/users',
                                },
                                {
                                    header: 'Add User', link: '/admin/users/new',
                                },
                            ]}
                        />	

                    </ul>
                </nav >
            </div>
        );
	} else {
        return (
            <div className={`${(!this.props.sidebarOpened && !this.props.sidebarStatic) ? s.sidebarClose : ''} ${s.sidebarWrapper}`}>
                <nav
                    onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
                    className={s.root}
                >
                    <header className={s.logo}>
                        <a href="/">{/*<img src="https://dealermasters.com/img/logo-dm.png"/>*/}<span className={s.logoStyle}>DM</span></a>
                    </header>
                    <ul className={s.nav}>
                        <LinksGroup
                            onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                            activeItem={this.props.activeItem}
                            header="Dashboard"
                            isHeader
                            iconName="flaticon-home"
                            link="/app/main"
                            index="main"
                            childrenLinks={[
                                {
                                    header: 'Dashboard', link: '/app/main/sites',
                                }
                            ]}
                        />
                        
                        {isMatch ?  (
                        
                        <LinksGroup
                            onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                            activeItem={this.props.activeItem}
                            header="Site"
                            isHeader
                            iconName="flaticon-internet"
                            link={`/app/main/sites/${pathMatch.params.site_id}`}
                            index={`/app/main/sites/${pathMatch.params.site_id}`}
                            exact={false}
                            childrenLinks={[
                                {
                                    header: 'Welcome', link: `/app/main/sites/${pathMatch.params.site_id}/landing`,
                                },
                                {
                                    header: 'Pages', link: `/app/main/sites/${pathMatch.params.site_id}/pages`,
                                },
                                {
                                    header: 'Settings', link: `/app/main/sites/${pathMatch.params.site_id}/settings`,
                                },
                                {
                                    header: 'Navigation', link: `/app/main/sites/${pathMatch.params.site_id}/navigation`,
                                },
                                {
                                    header: 'Inventory', link: `/app/main/sites/${pathMatch.params.site_id}/inventory`
                                },
                                {
                                    header: 'Analytics', link: `/app/main/sites/${pathMatch.params.site_id}/analytics`,
                                }
                            ]}
                        />
                        ) : ''}
                    </ul>
                </nav >
            </div>
        );
	}
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
