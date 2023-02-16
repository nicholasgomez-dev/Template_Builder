import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router';
import { Link, matchPath } from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from '../../../components/Loader/Loader';
import { isEmpty } from '../../../utilityFunctions';
import "./inventoryRules.scss";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap';

export const InventoryRulesContext = React.createContext();

const InventoryRulesProvider = (props) => {
  const contextProps = props.props;
  const {  dealerRef, list, siteId, dealers, dealerCurrent, listCurrent, ruleItem} = contextProps;
  const { location, history } =  contextProps; //location grabbed from props for navigation
  const [loading, setLoading] = useState(false); //Hide show loading component, set to false to show it
	const [dealerIDSelected, setDealerIDSelected ] = useState(dealerRef );
  const [listOfRules, setListOfRules] = useState(props.listCurrent.current);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [error, setError]= useState(false);
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [saveLoader, setSaveLoader] = useState(false);

  function sortEverything(rulesToSort){
    if(rulesToSort !== null){
      return rulesToSort.sort(function(a, b){return a.Order-b.Order})
    }else{
    return [];
  }
  }

  function saveItems(){

    let saveSiteId = props.siteId;
    let rulesToSave =  props.listCurrent.current;
    
    setSaveLoader(true);
      console.log(props.dealerCurrent.current);
    try{
      axios.post(`${process.env.API}/api/inventory/${saveSiteId}/${props.dealerCurrent.current}/createInventoryRule`, {
        rulesToSave
      })
      .then(d => {
        // let newData = JSON.parse(d.data.Payload);
        // console.log(newData.body);
        toast.success('Order of the rules updated.')
        setModal(false);
        setSaveLoader(false);
      })
      .catch(err => {
        toast.error('Something went wrong in saving the new order.')
        console.log(err);
        setModal(false);
        setSaveLoader(false);
      })
    }catch(err){
      console.log(err)
    }
  
  }
  function removeRules( DealerID) {
    setSaveLoader(true);
    try{
      axios.post(`${process.env.API}/api/inventory/${props.siteId}/${DealerID}/removeInventoryRule`, {
          DealerID:DealerID,
          RuleID:  props.ruleItem.current
      }).then(s => {
        let currentList = props.listCurrent.current;
        let copyListItems = currentList.filter(x => x.RuleID !== props.ruleItem.current);
        props.listCurrent.current = sortEverything(copyListItems);
        copyListItems = props.listCurrent.current;
        let rulesToSave = [];
        for(let i = 0; i < copyListItems.length; i++){
          copyListItems[i].Order = i + 1;
          rulesToSave.push(copyListItems[i]);
        } 
        axios.post(`${process.env.API}/api/inventory/${props.siteId}/${DealerID}/createInventoryRule`, {
          rulesToSave
        })
      }).then(d => {
        axios.post(`${process.env.API}/api/inventory/${props.siteId}/${DealerID}/getInventoryRules`, {
          DealerID: DealerID
        })
        .then(d => {
          let newData = JSON.parse(d.data.Payload);
          let dataList = newData.body;
          props.listCurrent.current = dataList;
          props.dealerCurrent.current = DealerID;
          setListOfRules(props.listCurrent.current);
          setDealerIDSelected(DealerID);
          setSaveLoader(false);
          setDeleteModal(false);
          toast.success('Rule deleted')
        })
      })
      .catch(err => {
        console.log(err);
        setSaveLoader(false);
        setDeleteModal(false);
        toast.error('Something went wrong trying to remove this rule');
      })
    }catch(err){
      console.log(err);
      setSaveLoader(false);
      setDeleteModal(false);
      toast.error('Something went wrong trying to remove this rule');
    }
  }

  //Path Match for navigation
  const pathMatch = matchPath(location.pathname, {
    path: '/app/main/sites/:site_id',
    exact: false,
    strict: true
  })

  const ButtonGroup = () => {

    return (
      <button id="orderChange" className="btn btn-success" 
      onClick={() => {setModal(true)}}
      >Save Order Changes</button>
    )

  }
  const ModalWrapper = (list,dealerRef, siteId ) => {
    return(
      <Modal className="modal" centered={true} isOpen={modal}>
        <ModalHeader 
        // toggle={closeModal}
        >Saving Order Change</ModalHeader>
        <ModalBody className="bg-white">
            <div className="youSure">
                {saveLoader? "Please wait while we apply the rules to the inventory. This may take a moment.":"Are you sure you want to change the order of how the rules apply?"}
            </div>
        </ModalBody>
        <ModalFooter>
            <Button 
              id="modalSave" 
              className="btn btn-success" 
               disabled={saveLoader? true : false }
              onClick={() => {saveItems(props.listCurrent.current, siteId,  props.dealerCurrent.current, history)}}
            >{saveLoader? 'Saving...' : 'Save Order'}</Button>
            <Button id="modalClose" color="gray" 
              onClick={()=>{setModal(false)}}
            >Close</Button>
        </ModalFooter>
    </Modal>
    )
  }
  const DeleteModalWrapper = (siteId ) => {
    return(
      <Modal className="modal" centered={true} isOpen={deleteModal}>
        <ModalHeader 
        // toggle={closeModal}
        >Saving Order Change</ModalHeader>
        <ModalBody className="bg-white">
            <div className="youSure">
            {saveLoader? "Please wait while we remove your rules. This may take a moment.":"Are you sure you want to Delete?"} 
            </div>
        </ModalBody>
        <ModalFooter>
            <Button 
              id="modalSave" 
              className="btn btn-success" 
               disabled={saveLoader? true : false }
              onClick={() => {removeRules(props.dealerCurrent.current)}}
            >{saveLoader? 'Removing Item...' : 'Remove Item'}</Button>
            <Button id="modalClose" color="gray" 
              onClick={()=>{setDeleteModal(false)}}
            >Close</Button>
        </ModalFooter>
    </Modal>
    )
  }
  function toTitleCase(string) {
    return (string !== undefined 
    ? string.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
      }).join(' ')
    : '')
    }
    function evalRuleEffect(effect, attributes) {
      let result = '';
      let checkVal = effect !== undefined ? effect : '';
      // console.log(checkVal)
      switch(checkVal ) {
          case "addPhoto":
            result += "Added a photo"
            break;
          case "addOption":
              result += "Added the option of: "
              result += (attributes.Value !== undefined && attributes.Value !== null )
                  ? attributes.Value.toString() : '' 
              break;
          case "addIncentive":
              result += "Added an incentive: "
              result += "Name: " + attributes.Value["Name"] + ', '
              result += "Description: " + attributes.Value["Description"] + ', '
              result += "Price: " + attributes.Value["Price"] + ', '
              result += "Priority: " + attributes.Value["Priority"] + ', '
              result += "Starts: " + attributes.Value["StartDate"] + ', '
              result += "Ends: " + attributes.Value["EndDate"]
              break;
          case "removeIncentive":
              result += "Remove Incentives"
              break;
          case "changePrice":
              result += "Change the "
              result += attributes.Field === "ExtraPrice1" ? "sale price" 
              : attributes.Field === "ExtraPrice2" ? "accessories price" 
              : attributes.Field === "Special" ? " dealer discount" 
              : "MSRP"
              result += attributes.Function === "Math" ? " by " : " to "
              result += "the following amount: "
              result += attributes.Value !== undefined && attributes.Value !== null ? attributes.Value.toString() : '' 
              break;
          case "setPrice":
              result += "Set the "
              result += attributes.Field === "ExtraPrice1" ? "sale price" 
              : attributes.Field === "ExtraPrice2" ? "accessories price" 
              : attributes.Field === "Special" ? " dealer discount" : "MSRP"
              result += " price to the following amount: "
              result += attributes.Value !== undefined && attributes.Value !== null ? attributes.Value.toString() : '' 
              break;
          case "changeField":
            result += "Change the field "
            result += attributes.Field !== undefined ? attributes.Field.toString() : '' 
            if(attributes.Subfield !== undefined && attributes.Subfield !== null && attributes.Subfield != ''){	
            result += "'s sub-field " + attributes.Subfield.toString()
            }
            
            result += " to the value: " 
            result += + attributes.Value !== undefined ? attributes.Value.toString() : '""'
          break;
          case "addField":
          case "addSubField":
              result += "Add the field "
              result += attributes.Field !== undefined ? attributes.Field.toString() : '' 
              if(attributes.Subfield !== undefined && attributes.Subfield !== null && attributes.Subfield != ''){	
              result += "'s sub-field " + attributes.Subfield.toString()
              }
              
              result += " with the value: " 
              result += + attributes.Value !== undefined ? attributes.Value.toString() : '""'
          
              break;
          case "addBanner":
              result += "Add a ribbon to the "
              console.log(attributes);
              switch(attributes.Value.placement) {
                  case "top":
                      result += "top of the "
                      break;
                  case "bottom":
                      result += "bottom of the "
                      break;
                  case "diagLeft":
                      result += "top left of the "
                      break;
                  case "diagRight":
                      result += "top right of the "
                      break;
                  default: break;
              }
              result += "card that reads: " + attributes.Value.text
              break;
          default:
              break;
      }
      
      return result;
      
  }
    
  function evalCompareType(val) {
      switch(val) {
      case "Equals":
          return " equals "
          break
      case "GreaterThan":
          return " greater than "
          break
      case "LessThan":
          return " less than "
          break
      case "Contains":
          return " contains "
          break
      default:
          return " "
          break
      }
  }
  function selectDealer(dealerID){
    setLoading(true); 
    try{
      axios.post(`${process.env.API}/api/inventory/${props.siteId}/${dealerID}/getInventoryRules`, {
        DealerID: dealerID
      }).then(d => {
        let newData = JSON.parse(d.data.Payload);
        let dataList = newData.body;
        props.listCurrent.current = dataList.sort(function(a, b){return a.Order-b.Order});;
        props.dealerCurrent.current = dealerID;
        setListOfRules(props.listCurrent.current)
        setDealerIDSelected(dealerID)
        setLoading(false);
      })
      .catch(err => {
          console.log(err);
      })
    }catch(err){
      console.log(err)
    }
  }

  const ListItem = (rules) => {

    const [activeItem, setActiveItem] = useState(false);
    // const [listItemsReset, setListItemReset] = useState(null);
    const [activeSort, setActiveSort] = useState(false);
    const [hint, setHint] = useState(false); 

    let r = rules.r;
    let index = rules.index;
    let setListRefresh = rules.setListRefresh;
    let forceUpdate = rules.forceUpdate;
    let setListItemActive = rules.setListItemActive;
    let DealerID = rules.DealerID;
    let ruleID = r.RuleID;
    let dragStart = rules.dragStart;
    let dragEnter = rules.dragEnter;
    let drop = rules.drop;

    const handleToggle = (i) => {
      setListItemActive(i.listItemActive)
      if(ruleID === i.listItemActive){
        setActiveItem(!activeItem)
      }
    }
    setListRefresh(null);

    function updateOnDrop(){
      drop();
      forceUpdate();
    }
    function setUpRemoveRules(rules){
      setDeleteModal(true); 
      props.ruleItem.current = rules;
    }

    return (
      <li className={'rule container rule-container' + ' ' + (activeItem ? 'active' : '')  + ' ' + (activeSort? 'activeSort': '')  + ' ' + (hint? 'hint': '')}  key={r?.RuleID} datasummary={ JSON.stringify(r)} onDragStart={(e) => dragStart(e, index)} 
      onDragEnter={(e) => dragEnter(e,  index)}
      onDragEnd={updateOnDrop}
      draggable>
           <span className="rule-order">{r.Order !== undefined ? r.Order.toString() : 'None'}</span>
           <label className="rule-name label" onClick={() => {if(r?.RuleID) handleToggle({ listItemActive:r.RuleID})}}>{r.Title !== undefined ? r.Title.toString() : 'None'}</label>
           <div className="rule-detail content">
           <ul className="rule-inc-crit">
            <li className="crit">
               {r.Criteria?.map((crit, index) => {
                
                     return(
                       <div key={index}>
                         <p className="header">{crit.RuleType === 'Inclusion' ? 'Applies to:' : 'Excluding:'}</p>
                         <p>{
                             toTitleCase(crit.Field) + evalCompareType(crit.Operator) + (crit.Value !== undefined  && crit.Value !== null  ? (typeof crit.Value === "string" ? crit.Value : crit.Value.toString()) : "")
                         }</p>
                         { crit.hasOwnProperty('subCriteria') && crit.subCriteria.length > 0 
                         ? crit.subCriteria.map((subCrit, index) => {
                             return( 
                               <div key={index}>
                                 <p>AND  {toTitleCase(subCrit.Field)} {evalCompareType(subCrit.Operator)} {subCrit.Value !== undefined  && subCrit.Value !== null  ? subCrit.Value.toString() : ''}
                                 </p> 
                               </div>
                               )
                             }
                         ) : <></> }
                 
               
                       </div>
                       )
                     })
                   }
               
                 </li>
                 <li className="effect">
                    <p className="header">Effect: </p>
                    <p>{evalRuleEffect(r.Type, r.Application)}</p>
                </li>
           </ul>
               <div className='button-row'>
         <Link
           className="btn btn-default"
           to={ location => (
             {
               ...location, 
               pathname: `/app/main/sites/${props.siteId}/${DealerID}/rules/${r.RuleID}/edit-rules`,
               state:{rule: r , SiteID: props.siteId, DealerID, order: props.listCurrent.current.length}
             }
           )
         }
         >Edit
         </Link>

         <Button className="btn btn-danger"  
            onClick={function() { setUpRemoveRules(r.RuleID, siteId,   props.dealerCurrent.current, history); }}
         >
             Delete
         </Button>
        </div>
           </div>
       </li>
     )
  }
  


  const ListComponentTwo = () => {
    const [listItemActive, setListItemActive] = useState(null);
    const [listRefresh, setListRefresh] = useState(listOfRules);
    const [activeSort, setActiveSort] =useState(false);
    const [hint, setHint] = useState(false);
    const [state, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    
    let rule= sortEverything(listOfRules) ;
    let DealerID =  props.dealerCurrent.current;
 
    const dragStart = (e, position) => {
      dragItem.current = position;
      setActiveSort(true)
    };
 
    const dragEnter = (e, position) => {
      e.preventDefault();
      if(document.querySelectorAll('.activeSort').length > 0)
        document.querySelector('.activeSort').classList.remove('activeSort')
      e.target.parentElement.classList.add('activeSort')
      dragOverItem.current = position;
      setHint(true);
    };

    const drop = (e) => {
      if(document.querySelectorAll('.activeSort').length > 0)
        document.querySelector('.activeSort').classList.remove('activeSort')

      let newOrder = [];
      const copyListItems = [...props.listCurrent.current];
      const dragItemContent = copyListItems[dragItem.current];

      copyListItems.splice(dragItem.current, 1);
      copyListItems.splice(dragOverItem.current, 0, dragItemContent);
      
      dragItemContent.Order = dragOverItem.current;
      for(let i = 0; i < copyListItems.length; i++){
        copyListItems[i].Order = i + 1;
        newOrder.push(copyListItems[i]);
      }
      props.listCurrent.current = sortEverything(newOrder);
      setListRefresh(props.listCurrent.current);
      setActiveSort(false);
      setHint(false);
    };
      
    return(
      <>
      {loading?
        <Loader/>
        :
        <>
        {rule?.length > 0?
          <ul  id="allLists" className="accordion">
          {rule.map((r, index) => 
          
            <ListItem 
              key={r.RuleID} 
              r={r}
              listItemActive={listItemActive} 
              setListItemActive={setListItemActive} 
              DealerID={DealerID} 
              dragItem={dragItem}
              dragOverItem={dragOverItem}
              index={index}
              dragStart={dragStart}
              dragEnter={dragEnter}
              setListRefresh={setListRefresh}
              listRefresh={listRefresh}
              drop={drop}
              forceUpdate={forceUpdate}
            /> 
          )}
          </ul>
          :
          <>
            <p>This dealership has no rules for their inventory yet. Please click Add New to create an inventory rule.</p>
          </>
        }
        </>
      }
      </>
    )
  }
  const DealerLists =  props.dealers?.map( (d) => {
      return <option value={d.DealerID} key={d.DealerID}>{d.DealerName}</option>
    }
  );
  const Select = () => {
  
    return(
      <select className="inputDropdown form-control" value={ props.dealerCurrent.current } onChange={ (event) => {
        props.dealerCurrent.current = event.target.value;
        selectDealer(event.target.value);
      }}>
      {DealerLists}
      </select>
    )
  }

  const inventoryRulesProps = { props, dealerCurrent, listCurrent, ListComponentTwo, selectDealer, ButtonGroup,  ModalWrapper, location, Select, DeleteModalWrapper }
  
  return (
    <InventoryRulesContext.Provider value={inventoryRulesProps}>
      {props.children}
    </InventoryRulesContext.Provider>

  );
}

export default InventoryRulesProvider;
