import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Loader from '../../../components/Loader/Loader';
import "./inventoryRules.scss";
import InventoryRules from './inventoryRules';
import InventoryRulesProvider from './inventoryRulesContext';

const InventoryRulesWrap = (props) => {
  let listRef = useRef(null);
  let dealerRef = useRef(null);
  let ruleItem = useRef(null);
  const [siteId, setSiteId ] = useState(props.match.params.site_id);
  const [dealers, setDealers] = useState([]);
  const [isBusy, setBusy] = useState(true);

  useEffect(() => {    
    const fetchData = async () => { 
      await axios.get(`${process.env.API}/api/sites/${siteId}/settings`)
      .then(siteSettings => { 
        setDealers(siteSettings.data.dealers);
        try{
          return siteSettings.data?.dealers[0]?.DealerID;
        }catch(err){
          dealerRef.current = [];
          return err;
        }
      }).then(dealerId => {
        dealerRef.current = dealerId
        axios.post(`${process.env.API}/api/inventory/${siteId}/${dealerId}/getInventoryRules`, {
          DealerID: dealerId
        }).then(d => {
          let newData = JSON.parse(d.data.Payload);
          let items = newData.body;
          listRef.current = items.sort(function(a, b){return a.Order-b.Order});
          setBusy(false);
         return;
        }).catch(err => {
            console.log(err);
            setBusy(false);
            dealerRef.current = [];
        })
      })
    }

    fetchData();
  
  },[]); 
  const Rules = () => {

    return (
      <>
      {isBusy? 
        <Loader />
        :
        <>
          <InventoryRulesProvider props={props} dealerRef={dealerRef.current} dealerCurrent={dealerRef} siteId={siteId} list={listRef.current} listCurrent={listRef} ruleItem={ruleItem} dealers={dealers}>
            <InventoryRules />
          </InventoryRulesProvider>
        </>
      }
      </>
    )
  }
  
  return (
    <>
    <Rules />
    </>
  );

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

export default withRouter(connect(mapStateToProps)(InventoryRulesWrap));