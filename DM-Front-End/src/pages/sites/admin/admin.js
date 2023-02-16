import React, {useEffect, useState} from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';

const Admin = (props) => {

  const [siteSettings, setSiteSettings] = useState([]); //State for siteSettings
  const [savedAnalyticsUrl, setSavedAnalyticsUrl] = useState(""); //State for the Analytics URL itself
  const [analyticsUrl, setAnalyticsUrl] = useState(""); //State for the Analytics URL itself
  const [validateForm, setValidateForm] = useState(""); //State for validation messages
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user-data')).dm_user_type === 'omni');

  useEffect(()=>{
    
    //Get Request for site settings and save siteSettings and the analytics URL to states
    axios.get(`${process.env.API}/api/sites/${props.match.params.site_id}/settings`)
    .then(siteSettings => {
        setSiteSettings(siteSettings.data);
        setSavedAnalyticsUrl(siteSettings.data?.siteAnalytics);
     })
    .catch(err => {
        console.log(err);
    })
  },[]);

  //Validation to prevent users from submitting the whole embed code into the iframe and only submit the desired URL
  //Only submit the form after all validation is passed
  //Clear any failed submission messages by setting the ValidateForm variable to an empty string
  function validateUrl(){
    if(analyticsUrl.includes('<iframe')){setValidateForm('submission cannot include <iframe>, only submit URL'); return;}
    if(analyticsUrl.includes('<embed')){setValidateForm('submission cannot include <embed>, only submit URL'); return;}
    if(analyticsUrl === ('')){setValidateForm('submission cannot be empty'); return;}
    handleSubmit();
    setValidateForm('');    
  }

  //Submit analyticsUrl set in state to the siteMetaData API
  function handleSubmit(){
    return axios.put(process.env.API + `/api/sites/${props.match.params.site_id}/siteMetaData`, { site_meta_data: analyticsUrl })
    .then(result => {
      console.log('Analytics is submitted');
    })
    .catch(err => {
        console.log(err);
    })
  }

  //Save the anlyticsUrl in state
  function holdAnalyticsValue(val){
    setAnalyticsUrl(val);
  }
  
  return(
    <>
      <h2 className="page-title">Admin Panel</h2>
        {userInfo?  
        <Formik  onSubmit={()=>validateUrl()}>
          <Form style={{display:'block', borderRadius:15, backgroundColor:'#ffffff', padding:'15px 20px', boxShadow:'0 0 10px #bfbfbf'}}>
            <label style={{display:'block'}} htmlFor="">Analytics URL: </label>
            <Field style={{display:'block', width:'100%'}} required name="analyticsUrl" label="Analytics URL" type="textarea" placeholder={savedAnalyticsUrl?savedAnalyticsUrl:"Enter Analytics Embed URL Only"} wrap="hard" onChange={(e)=>holdAnalyticsValue(e.target.value)} />
            <div style={{display:'flex', alignItems:'center', marginTop:15}}>
              <button
                className="btn btn-primary"
                type="button"
                style={{display:'block'}}
                onClick={()=>validateUrl()}
                >Save URL
              </button>
              <div style={{marginLeft:15}}>{validateForm}</div>
            </div>
          </Form>
        </Formik>
        :
        <div>
          <p>Analytics for this site is not set up yet. To add reports to the analytics panel, please contact your account manager.</p>
        </div>
        }
    </>
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

export default withRouter(connect(mapStateToProps)(Admin));
 