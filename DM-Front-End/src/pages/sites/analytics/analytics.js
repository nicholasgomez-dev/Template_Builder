import React, {useEffect, useState} from 'react';
import { withRouter } from 'react-router';
import { Link, matchPath } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Button
} from 'reactstrap';
import Loader from '../../../components/Loader/Loader';

const Analytics = (props) => {

  const [siteSettings, setSiteSettings] = useState([]) //State for Site Settings
  const [analyticsUrl, setAnalyticsUrl] = useState(""); //State for the Analytics URL itself
  const [loading, setLoading] = useState(false); //Hide show loading component, set to false to show it
  const { location } = props; //location grabbed from props for navigation
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user-data')).dm_user_type === 'omni'); //Current user data from localStorage

  useEffect(()=>{

    //Get Request for site settings and save siteSettings and the analytics URL to states and set the loading component to true to hide it
    axios.get(`${process.env.API}/api/sites/${props.match.params.site_id}/settings`)
    .then(siteSettings => {
        setSiteSettings(siteSettings);
        setLoading(true);
        setAnalyticsUrl(siteSettings.data?.analyticsUrl);
     })
    .catch(err => {
        console.log(err);
        setLoading(true);
    })

  },[]);

  //Path Match for navigation
  const pathMatch = matchPath(location.pathname, {
    path: '/app/main/sites/:site_id',
    exact: false,
    strict: true
  })

  return(
    <>
      <h2 className="page-title">Analytics</h2>
      {loading?
      <>
          {analyticsUrl?
            <div style={{position:'relative', height:1350, width:'100%', overflow: 'hidden', boxShadow:'0 0 15px #898989'}}>
              <iframe src={analyticsUrl}
                      style={{display: 'block',position: 'absolute', top:0, left:0, right:0,  bottom:0, width:'100%', height:'100%', overflow:'scroll', border:'none', }}
                      allowFullScreen>
              </iframe>
            </div>
          :
          <div>
              {userInfo ?
                  <div>
                      <p>Analytics for this site is not set up yet. To display analytics in this panel, please enter your
                          report embed URL in the admin panel.</p>
                      <Link
                          to={location => ({...location, pathname: `/app/main/sites/${pathMatch.params.site_id}/admin`})}
                      >
                          <Button color="primary">Go To Admin</Button>
                      </Link>
                  </div>
                  :
                  <div>
                  <p>Analytics for this site is not set up yet. To display analytics in this panel, please contact your account manager.</p>
                  </div>
              }
          </div>
          }
        </> //END ANALYTICSURL WRAP
      :
      <Loader size={75}/>
      }
    </> //END LOADING WRAP
  )
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

export default withRouter(connect(mapStateToProps)(Analytics));
