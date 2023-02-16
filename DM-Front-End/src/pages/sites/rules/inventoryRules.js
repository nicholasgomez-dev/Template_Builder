import React, {useEffect, useState, useRef, useContext, useCallback} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router';
import { Link, matchPath } from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from '../../../components/Loader/Loader';
import { isEmpty } from '../../../utilityFunctions';
import { InventoryRulesContext } from "./inventoryRulesContext";
import "./inventoryRules.scss";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap';

const InventoryRules = () => {

  const inventoryRulesProps = useContext(InventoryRulesContext);
  const {props,  ListComponentTwo, selectDealer, ButtonGroup,  ModalWrapper, location, Select, DeleteModalWrapper} = inventoryRulesProps;
  const {dealerRef, siteId, list, dealers, dealerCurrent, listCurrent} = props;

  
  //Path Match for navigation
  const pathMatch = matchPath(location.pathname, {
    path: '/app/main/sites/:site_id',
    exact: false,
    strict: true
  })

  return(
    <>
      <div>
        <h2 style={{marginBottom: "2rem", paddingLeft: "2rem"}}>Inventory Rules</h2>
        <div id="dealer-select">
          <h3>Inventory Select: </h3>
          <Select/>
        </div>
        <div id="card">
          <h3>
            <span>Current Rules</span>
            <Link
              to={location => (
                {...location, 
                pathname: `/app/main/sites/${pathMatch.params.site_id}/${dealerCurrent.current}/rules/create-rules`,
                state:{
                  DealerID: dealerCurrent.current ,
                  order: listCurrent.current? listCurrent?.current.length + 1 : 1
                }
              })}
            >
              <button  className="addRule btn btn-default">Add New </button>
            </Link>
          </h3>
          <ListComponentTwo/>
          <ButtonGroup/>
        </div>
        <DeleteModalWrapper  dealerId={dealerRef} siteId={siteId} />
        <ModalWrapper list={list} dealerId={dealerRef} siteId={siteId}/>
      </div>
    </>
  );
}

export default  InventoryRules; 