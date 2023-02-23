import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Hammer from 'rc-hammerjs';

import Profile from '../../pages/profile';
import UIButtons from '../../pages/ui-elements/buttons';
import UIIcons from '../../pages/ui-elements/icons';
import UITabsAccordion from '../../pages/ui-elements/tabs-accordion/';
import UINotifications from '../../pages/ui-elements/notifications';
import UIListGroups from '../../pages/ui-elements/list-groups';
import FormsElements from '../../pages/forms/elements';
import FormsValidation from '../../pages/forms/validation';
import FormsWizard from '../../pages/forms/wizard';
import TablesStatic from '../../pages/tables/static';
import TablesDynamic from '../../pages/tables/dynamic';
import MapsGoogle from '../../pages/maps/google';
import MapsVector from '../../pages/maps/vector';
import ExtraCalendar from '../../pages/extra/calendar';
import ExtraInvoice from '../../pages/extra/invoice';
import ExtraSearch from '../../pages/extra/search';
import ExtraTimeline from '../../pages/extra/timeline';
import ExtraGallery from '../../pages/extra/gallery';
import Grid from '../../pages/grid';
import ChatPage from '../../pages/chat';
import Widgets from '../../pages/widgets';
import Templates from '../../pages/products/Template';
import ListPages from '../../pages/sites/pages/ListPages'
import Management from '../../pages/management';
import Product from '../../pages/product';
import Package from '../../pages/package';
import Email from '../../pages/email';
import CoreTypography from '../../pages/core/typography';
import CoreColors from '../../pages/core/colors';
import CoreGrid from '../../pages/core/grid';
import UIAlerts from '../../pages/ui-elements/alerts';
import UIBadge from '../../pages/ui-elements/badge';
import UICard from '../../pages/ui-elements/card';
import UICarousel from '../../pages/ui-elements/carousel';
import UIJumbotron from '../../pages/ui-elements/jumbotron';
import UIModal from '../../pages/ui-elements/modal';
import UIProgress from '../../pages/ui-elements/progress';
import UINavbar from '../../pages/ui-elements/navbar';
import UINav from '../../pages/ui-elements/nav';
import UIPopovers from '../../pages/ui-elements/popovers';
import Charts from '../../pages/charts';
import ApexCharts from '../../pages/charts/apex';
import Echarts from '../../pages/charts/echarts';
import HighCharts from '../../pages/charts/highcharts';
import DashboardAnalytics from '../../pages/analytics';
import Dashboard from '../../pages/dashboard';
import UserFormPage from '../Users/form/UsersFormPage';
import UserListPage from '../Users/list/UsersListPage';
import UserViewPage from '../Users/view/UsersViewPage';
import ChangePasswordFormPage from '../Users/changePassword/ChangePasswordFormPage';
import { SidebarTypes } from '../../reducers/layout';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { openSidebar, closeSidebar, toggleSidebar } from '../../actions/navigation';
import s from './Layout.module.scss';
import { DashboardThemes } from '../../reducers/layout';
import ProductEdit from '../../pages/management/components/productEdit';
import BreadcrumbHistory from '../BreadcrumbHistory';
import Login from '../../pages/login';
import CheckWork from '../../form-components/CheckWorkPage/CheckWorkPage'
import EditPage from '../../pages/sites/pages/editPage';
import SettingsEditForm from '../../pages/sites/siteSettings/settingsEditForm';
import SiteNav from '../../pages/sites/siteNav/siteNav';
import InventoryTable from '../../pages/inventory/InventoryTable';
import Analytics from '../../pages/sites/analytics/analytics';
import Admin from '../../pages/sites/admin/admin.js';
import SiteLanding from '../../pages/sitelanding/siteLanding'
import InventoryRulesWrap from '../../pages/sites/rules/inventoryRulesWrap';
import RuleEdit from '../../pages/sites/rules/ruleEdit';
import ListTemplates from '../../pages/templates/List/ListTemplates';
import CreateTemplate from '../../pages/templates/Create/CreateTemplate';
import BuildTemplate from '../../pages/templates/Build/BuildTemplate';
import ListDealers from '../../pages/dealers/List/ListDealers';
import ListVariables from '../../pages/variables/List/ListVariables';

class Layout extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dashboardTheme: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sidebarStatic: false,
    sidebarOpened: false,
    dashboardTheme: DashboardThemes.DARK
  };
  constructor(props) {
    super(props);
    
    this.handleSwipe = this.handleSwipe.bind(this);
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    if (window.innerWidth <= 768 && this.props.sidebarStatic) {
      this.props.dispatch(toggleSidebar());
    }
  }

  handleSwipe(e) {
    if ('ontouchstart' in window) {
      if (e.direction === 4) {
        this.props.dispatch(openSidebar());
        return;
      }

      if (e.direction === 2 && this.props.sidebarOpened) {
        this.props.dispatch(closeSidebar());
        return;
      }
    }
  }

  render() {
    return (
      <div
        className={[
          s.root,
          this.props.sidebarStatic ? `${s.sidebarStatic}` : '',
          !this.props.sidebarOpened ? s.sidebarClose : '',
          'sing-dashboard',
          `dashboard-${(this.props.sidebarType === SidebarTypes.TRANSPARENT) ? "light" : this.props.dashboardTheme}`,
        ].join(' ')}
      >
        
        <Sidebar />
        <div className={s.wrap}>
          <Header />
          
          <Hammer onSwipe={this.handleSwipe}>
            <main className={s.content}>
              <TransitionGroup>
                <CSSTransition
                  key={this.props.location.key}
                  classNames="fade"
                  timeout={200}
                >
                  <Switch>
                
                    <Route path="/app/main" exact render={() => <Redirect to="/app/main/templates" />} />
                   
                    <Route path="/app/main/sites/:site_id/rules" exact component={InventoryRulesWrap}/>
                    
                    <Route path="/app/main/sites/:site_id/:dealer_id/rules/create-rules" exact component={RuleEdit} />
                    <Route path="/app/main/sites/:site_id/:dealer_id/rules/:rule_id/edit-rules" exact component={RuleEdit}/>
                    <Route path="/app/main/sites/create" exact component={Dashboard} />
                    <Route path="/app/main/widgets" exact component={Widgets} />
                    <Route path="/app/main/form-components" exact component={CheckWork} />
                    <Route path="/app/main/sites" exact component={DashboardAnalytics} />
                    <Route path="/app/main/sites/:id/selectTemplate" exact component={Templates} />
                    <Route path="/app/main/sites/:site_id/pages" exact component={ListPages} />
                    <Route path="/app/main/sites/:site_id/pages/:page_id" exact component={EditPage} />
                    <Route path="/app/main/sites/:site_id/inventory" exact component={InventoryTable} />
                    <Route path="/app/main/sites/:site_id/admin" exact component={Admin} />
                    <Route path="/app/main/sites/:site_id/settings" exact component={SettingsEditForm} />
                    <Route path="/app/main/sites/:site_id/navigation" exact component={SiteNav} />
                    <Route path="/app/main/sites/:site_id/analytics" exact component={Analytics} />
                    <Route path="/app/main/sites/:site_id/landing" exact component={SiteLanding} />
                    <Route path="/app/main/templates" exact component={ListTemplates} />
                    <Route path="/app/main/templates/create" exact component={CreateTemplate} />
                    <Route path="/app/main/templates/build" exact component={BuildTemplate} />
                    <Route path="/app/main/dealers" exact component={ListDealers} />
                    <Route path="/app/main/variables" exact component={ListVariables} />
                    <Route path="/app/edit_profile" exact component={UserFormPage} />
                    <Route path="/app/password" exact component={ChangePasswordFormPage} />
                    <Route path="/admin" exact render={() => <Redirect to="/admin/users" />} />
                    <Route path="/admin/users" exact component={UserListPage} />
                    <Route path="/admin/users/new" exact component={UserFormPage} />
                    <Route path="/admin/users/:id/edit" exact component={UserViewPage} />
                    <Route path="/admin/users/:id" exact component={UserViewPage} />
                    <Route path="/app/ecommerce" exact render={() => <Redirect to="/app/ecommerce/management" />} />
                    <Route path="/app/ecommerce/management" exact component={Management} />
                    <Route path="/app/ecommerce/management/:id" exact component={ProductEdit} />
                    <Route path="/app/ecommerce/management/create" exact component={ProductEdit} />
                    <Route path="/app/ecommerce/product/:id" exact component={Product} />
                    <Route path="/app/profile" exact component={Profile} />
                    <Route path="/app/inbox" exact component={Email} />
                    <Route path="/app/ui" exact render={() => <Redirect to="/app/ui/components" />} />
                    <Route path="/app/ui/buttons" exact component={UIButtons} />
                    <Route path="/app/ui/icons" exact component={UIIcons} />
                    <Route path="/app/ui/tabs-accordion" exact component={UITabsAccordion} />
                    <Route path="/app/ui/notifications" exact component={UINotifications} />
                    <Route path="/app/ui/list-groups" exact component={UIListGroups} />
                    <Route path="/app/ui/alerts" exact component={UIAlerts} />
                    <Route path="/app/ui/badge" exact component={UIBadge} />
                    <Route path="/app/ui/card" exact component={UICard} />
                    <Route path="/app/ui/carousel" exact component={UICarousel} />
                    <Route path="/app/ui/jumbotron" exact component={UIJumbotron} />
                    <Route path="/app/ui/modal" exact component={UIModal} />
                    <Route path="/app/ui/popovers" exact component={UIPopovers} />
                    <Route path="/app/ui/progress" exact component={UIProgress} />
                    <Route path="/app/ui/navbar" exact component={UINavbar} />
                    <Route path="/app/ui/nav" exact component={UINav} />
                    <Route path="/app/grid" exact component={Grid} />
                    <Route path="/app/chat" exact component={ChatPage} />
                    <Route path="/app/package" exact component={Package} />
                    <Route path="/app/forms" exact render={() => <Redirect to="/app/forms/elements" />} />
                    <Route path="/app/forms/elements" exact component={FormsElements} />
                    <Route path="/app/forms/validation" exact component={FormsValidation} />
                    <Route path="/app/forms/wizard" exact component={FormsWizard} />
                    <Route path="/app/charts/" exact render={() => <Redirect to="/app/charts/overview" />} />
                    <Route path="/app/charts/overview" exact component={Charts} />
                    <Route path="/app/charts/apex" exact component={ApexCharts} />
                    <Route path="/app/charts/echarts" exact component={Echarts} />
                    <Route path="/app/charts/highcharts" exact component={HighCharts} />
                    <Route path="/app/tables" exact render={() => <Redirect to="/app/tables/static" />} />
                    <Route path="/app/tables/static" exact component={TablesStatic} />
                    <Route path="/app/tables/dynamic" exact component={TablesDynamic} />
                    <Route path="/app/extra" exact render={() => <Redirect to="/app/extra/calendar" />} />
                    <Route path="/app/extra/calendar" exact component={ExtraCalendar} />
                    <Route path="/app/extra/invoice" exact component={ExtraInvoice} />
                    <Route path="/app/extra/search" exact component={ExtraSearch} />
                    <Route path="/app/extra/timeline" exact component={ExtraTimeline} />
                    <Route path="/app/extra/gallery" exact component={ExtraGallery} />
                    <Route path="/app/maps" exact render={() => <Redirect to="/app/maps/google" />} />
                    <Route path="/app/maps/google" exact component={MapsGoogle} />
                    <Route path="/app/maps/vector" exact component={MapsVector} />
                    <Route path="/app/core" exact render={() => <Redirect to="/app/core/typography" />} />
                    <Route path="/app/core/typography" exact component={CoreTypography} />
                    <Route path="/app/core/colors" exact component={CoreColors} />
                    <Route path="/app/core/grid" exact component={CoreGrid} />
                    <Route path="/login" exact component={Login}/>
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
              <footer className={s.contentFooter}>
                Made with Love by <a href="https://dealermasters.com" target="_blank">Dealer Masters</a>
              </footer>
            </main>
          </Hammer>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    dashboardTheme: store.layout.dashboardTheme,
    sidebarType: store.layout.sidebarType,
    currentUser: store.auth.currentUser,
  };
}

export default withRouter(connect(mapStateToProps)(Layout));
