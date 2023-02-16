import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Link, matchPath } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../../components/Loader/Loader';
import "./ruleEdit.scss";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap';

class RuleEdit extends React.Component { 
    
    constructor(props) {
        super(props);
        this.state={
            show: false,
            error: false,
            rule: this.props.location.state?.rule ? this.props.location.state.rule : JSON.parse(localStorage.getItem('Rule')),
            DealerID: this.props.location.state?.DealerID ? this.props.location.state.DealerID :  localStorage.getItem('DealerID'),
            SiteID: this.props.match.params.site_id,
            modal: false,
            order: this.props.location.state?.order ? this.props.location.state.order : localStorage.getItem('Order'),
            // order: this.props.location.state?.hasOwnProperty('order') ? this.props.location.state.order : localStorage.getItem('Order'),
            history: this.props.history,
            isBool: false,
            noSelect:true
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    async componentDidMount() {
        // if(this.sampleFrontEndRule){loadIn(this.sampleFrontEndRule)}

        if(this.props.location.pathname.indexOf('create-rules') > -1){
            localStorage.removeItem('Rule');
            this.setState({rule:''});
            populateChangeFields()
            loadIn('', this.state.DealerID);
            
        }else{
            populateChangeFields()
            loadIn(this.state.rule,  this.state.DealerID)
        }
        
        if(this.state.DealerID){
            localStorage.setItem('DealerID', this.state.DealerID)
        }
        if(this.state.order){
            localStorage.setItem('Order', this.state.order)
        }
        if(this.state.rule){
            localStorage.setItem('Rule', JSON.stringify(this.state.rule))
        }
    }
    openModal = (err = false) => {this.setState({show: true, error: err})}
    closeModal = () => {this.setState({show: false})}
    changeBool = (val) => {this.setState({isBool: val})}
    render() {
        return (<div>
                <h2 style={{marginBottom: "2rem"}}>{this.state.order ? "Create" : "Edit"} Inventory Rule</h2>
                <div id="includes">
                    <h3>Rule Title</h3>
                    <input id="ruleName" className="inputTextModule form-control" type="textbox" placeholder="My Rule"/>
                    <h3>Include Vehicles Where: </h3> 
                    <div id="includes-cont">
                        <div className="rule-include">
                            <div className="toprow">
                                <div className="row-cont">
                                    <select id="include-field" className="field inputDropdown" onChange={(e) => {onChangeRow(e.target, this.state.DealerID)}}>
                                    </select>
                                    <select className="compareType inputDropdown" onChange={(e) => {onChangeRow(e.target, this.state.DealerID)}}>
                                        <option className="number string bool" value="equals">Equals</option>
                                        <option className="number"value="greater">Greater Than</option>
                                        <option className="number"value="less">Less Than</option>
                                        <option className="string" style={{display: "none"}} value="contains">Contains</option>
                                    </select>
                                    {/* {this.state.noSelect? */}
                                        <>
                                            {this.state.isBool? 
                                            
                                            <select className="value form-control inputTextModule" onChange={(e) => {onChangeRow(e.target, this.state.DealerID)}}>
                                                    <option value="true">true</option>
                                                    <option value="false">false</option>
                                                </select>
                                            :
                                            <input placeholder="Value here" className="value form-control inputTextModule" onChange={(e) => {onChangeRow(e.target, this.state.DealerID)}} />
                                            
                                            }
                                        </>
                                        {/* :
                                        null
                                    } */}
                                </div>
                            </div>
                            <div className="bottomRow"><div className="subcriteria-list"></div>
                                <button className="add-subcrit" onClick={e => addSubcriteria(e.target)}>+ Add Subcriteria</button>
                            </div>
                        </div>
                    </div>
                </div>
        

                <div id="excludes">
                    <h3>Exclude Vehicles Where: <button className="btn btn-success" onClick={e => addRuleRow('exclude')}>+</button></h3>
                    <div id="excludes-cont"></div>
                </div>
                
                <div id="change">
                    <h3>Update: </h3>

                    <div id="changesList">
                        <select id="changeOptions" className="all-changes inputDropdown" onChange={(e) => selectFields(e.target)}>
                            <option value="RI">Remove Incentives</option>
                            <option value="AI">Add New Incentive</option>
                            <option value="AB">Add Banner</option>
                            <option value="AO">Add Option</option>
                            <option value="AP">Add Photo</option>
                            <option value="CF">Change Field</option>
                            <option value="CP">Change Sale Price</option>
                            <option value="CM">Change MSRP</option>
                            <option value="CD">Change Dealer Discount</option>
                            <option value="CA">Change Accessories Price</option>

                        </select>
                        <select className="inputDropdown price sub-options changePrice" onChange={(e) => selectFields(e.target)}>
                            <option className="changePriceOpt" value="I">Increase Price</option>
                            <option className="changePriceOpt" value="D">Decrease Price</option>
                            <option className="changePriceOpt" value="S">Set Price</option>
                        </select>
                        <select className="inputDropdown field sub-options changeField" onChange={(e) => selectFields(e.target)}>
                        </select>
                    </div>

                    <div className="updates">
                        <div className="change-field changePrice val">
                            <label>Update: </label>
                            <input type="text" className="priceChange inputTextModule"/>
                        </div>
                        <div className="change-field changeField val">
                            <label>Change Value To: </label>
                            <input type="text" className="fieldChange inputTextModule"/>
                        </div>
                        
                        <div className="change-field addIncentive">
                            <label>Incentive Name</label>
                            <input type="text" id="Name" className="target inputTextModule"/>
                        </div>
                        <div className="change-field addIncentive">
                            <label>Description</label>
                            <input type="text" id="Description" className="target inputTextModule"/>
                        </div>
                        <div className="change-field addIncentive">
                            <label>Price</label>
                            <input type="number" id="Price" className="price inputTextModule"/>
                        </div>
                        <div className="change-field addIncentive">
                            <label>Priority</label>
                            <input type="number" id="Priority" className="priority inputTextModule"/>
                        </div>
                        <div className="change-field addIncentive">
                            <label>Start Date</label>
                            <input type="date" id="StartDate" className="startDate inputTextModule"/>
                        </div>
                        <div className="change-field addIncentive">
                            <label>End Date</label>
                            <input type="date" id="EndDate" className="endDate inputTextModule"/>
                        </div>
                        
                        <div className="change-field ribbon">
                            <label>Ribbon Text Color</label>
                            <input type="text" className="ribbonTxtColor inputTextModule"/>
                        </div>
                        <div className="change-field ribbon">
                            <label>Ribbon Text</label>
                            <input type="text" className="ribbonTxtVal inputTextModule"/>
                        </div>
                        <div className="change-field ribbon">
                            <label>Ribbon Background Color</label>
                            <input type="text" className="ribbonBG inputTextModule"/>
                        </div>
                        <div className="change-field ribbon">
                            <label>Ribbon Location</label>
                            <select className="inputDropdown">
                                <option value="top">Top</option>
                                <option value="diagLeft">Diagonal Top Left</option>
                                <option value="diagRight">Diagonal Top Right</option>
                                <option value="bottom">Bottom</option>
                            </select>
                        </div>
                        <div className="change-field photo">
                            <label>Photo URL</label>
                            <input type="text" className="inputTextModule"/>
                        </div>
                        <div className="change-field photo">
                            <label>Photo Alt Text</label>
                            <input type="text" className="inputTextModule"/>
                        </div>
                        <div className="change-field option">
                            <label>Option Description</label>
                            <input type="text" className="inputTextModule"/>
                        </div>
                    </div>
                    <button className="btn btn-success" id="update" onClick={() => {update(this.state.SiteID, this.state.rule, this.state.DealerID, this.state.order, this.openModal, this.state.history)}}>Set Rule</button>
                </div>

                <Modal centered={true} isOpen={this.state.show}>
                    <ModalHeader toggle={this.closeModal}>{this.state.error ? "Error" : "Success"}</ModalHeader>
                    <ModalBody className="bg-white">

                        <div className="youSure">
                            {this.state.error ? "Oops, something went wrong, please try again." : 'Rule successfully saved!'}
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="gray" onClick={this.closeModal}>Close</Button>
                    </ModalFooter>
                </Modal>
               
            </div>
        );
    };
}
const optionList = [
    { name: "All", 
      type: "string", translation: "DealerID"},
    { name: "Year", 
      type: "number", 
      translation: "Year" },
    { name: "Make", 
      type: "string", 
      translation: "Make" },
    { name: "Model", 
      type: "string", 
      translation: "Model" },
    { name: "Trim", 
      type: "string", 
      translation: "Trim" },
    { name: "VIN", 
      type: "string", 
      translation: "VIN" },
    { name: "Stock Number", 
      type: "string", 
      translation: "StockNumber" },
    { name: "Price", 
      type: "number", translation: "ExtraPrice1"},
    { name: "Body Style", 
      type: "string", 
      translation: "BodyStyle" },
    { name: "City MPG", 
      type: "number", 
      translation: "CityMPG" },
    { name: "Comments", 
      type: "string", 
      translation: "Comments" },
    { name: "Comments 2", 
      type: "string", 
      translation: "Comments2" },
    { name: "Comments 3", 
      type: "string", 
      translation: "Comments3" },
    { name: "Comments 4", 
      type: "string", 
      translation: "Comments4" },
    { name: "Comments 5", 
      type: "string", 
      translation: "Comments5" },
    { name: "Dealer Name", 
      type: "string", 
      translation: "DealerName" },
    { name: "Drivetrain", 
      type: "string", 
      translation: "Drivetrain" },
    { name: "Engine", 
      type: "string", 
      translation: "Engine" },
    { name: "Engine Fuel Type", 
      type: "string", 
      translation: "EngineFuelType" },
    { name: "Exterior Color", 
      type: "string", 
      translation: "ExteriorColor" },
    { name: "Generic Exterior Color", 
      type: "string", 
      translation: "GenericExteriorColor" },
    { name: "Highway MPG", 
      type: "number", 
      translation: "HwyMPG" },
    { name: "Interior Color", 
      type: "string", 
      translation: "InteriorColor" },
    { name: "Interior Material", 
      type: "string", 
      translation: "InteriorMaterial" },
    { name: "Is Certified", 
      type: "bool", 
      translation: "IsCertified" },
    { name: "Is New", 
      type: "bool", 
      translation: "IsNew" },
    { name: "Is Special", 
      type: "bool", 
      translation: "IsSpecial" },
    { name: "Locked", 
      type: "bool", 
      translation: "Locked"},
    { name: "Mileage", 
      type: "number", 
      translation: "Mileage" },
    { name: "Model Code", 
      type: "string", 
      translation: "ModelCode" },
    { name: "One Owner", 
      type: "bool", 
      translation: "OneOwner" },
    { name: "Style", 
      type: "string", 
      translation: "Style" },
    { name: "Transmission", 
      type: "string", 
      translation: "Transmission" },
    { name: "Transmission Speed", 
      type: "string", 
      translation: "TransmissionSpeed" },
    { name: "Value Source", 
      type: "bool", 
      translation: "ValueSource" },
    { name: "Vehicle History Report Link", 
      type: "string", 
      translation: "VehicleHistoryReportLink" },
    { name: "Vehicle ID", 
      type: "string", 
      translation: "VehicleID" },
    { name: "Vehicle Status", 
      type: "string", 
      translation: "VehicleStatus" },
    { name: "Video URL", 
      type: "string", 
      translation: "VideoUrl" },
    { name: "ZIP Code", 
      type: "number", 
      translation: "ZipCode" },
  ]

  function evalmenuType(val) {
    let item = optionList.find(element => element.name === val)
    return item !== undefined ? item.type : null
  }
  
  function loadIn(data,DealerID) {
        populateDropdown(document.getElementById('include-field'))
        document.getElementById('ruleName').value = data? data.Title : ''
        if(data !== undefined && data.Criteria !== undefined ){
            data.Criteria.forEach(crit => {
                if(crit.RuleType === "Inclusion") {
                    loadIncludeCriteria(crit)
                }
                else {
                    loadExcludeCriteria(crit)
                }
            })
             //load in effect
            loadApplication(data.Type, data.Application)
        }else{
            if(document.getElementById('include-field').value === 'All'){
               onChangeRow(document.getElementById('include-field'), DealerID);
            }
        }
  }
  
  function loadExcludeCriteria(data) {
      let row = addRuleRow('exclude')	
      setRowValue(row, data)
      
      if(data.subCriteria.length > 0) { 
          let subCrit = row.querySelector('.bottomRow .subcriteria-list')
          loadSubcriteria(data.subCriteria, subCrit)
      }
  }
  
  function loadIncludeCriteria(data) {
      let cont = document.querySelector('#includes-cont')
      setRowValue(cont, data)
      
      if(data.subCriteria.length > 0) {
          let subCrit = cont.querySelector('.bottomRow .subcriteria-list')
          loadSubcriteria(data.subCriteria, subCrit)
      }
  }
  
  function loadSubcriteria(data, parentRow) {
      data.forEach(subCrit => {
          let row = addSubcriteria(parentRow)
          setSubRowValue(row, subCrit)
      })
      
  }
  
  function setRowValue(container, data) {
      let mainField = container.querySelector('.toprow .field')
      mainField.value = data.Field !== null && data.Field !== undefined ? translateObj(data.Field.toString()) : translateObj('Price')
  
      let mainOperator = container.querySelector('.toprow .compareType')
      mainOperator.value = data.Operator !== null && data.Operator !== undefined ? processOperator(data.Operator) : processOperator('Equals')
      
      let mainValue = container.querySelector('.toprow .value')
      mainValue.value = data.Value !== null && data.Value !== undefined ? data.Value.toString() : ''

      let fieldType = evalmenuType(mainField.value)
      let rowTypeOpts = mainField.classList.contains('field') 
            ? mainOperator.parentElement.querySelectorAll('.compareType > option')
            : mainOperator.parentElement.querySelectorAll('.subcriteria-type > option')
        rowTypeOpts.forEach(opt => {
            if(opt.classList.contains(fieldType)) {
                opt.style.display = "block"
            }
            else {
                opt.style.display = "none"
            }
        })
  }
  
  function setSubRowValue(row, data) {
      let subField = row.querySelector('.subcriteria-field')
      subField.value = data.Field !== null && data.Field !== undefined ? translateObj(data.Field.toString()) : translateObj('Price')
  
      let subOperator = row.querySelector('.subcriteria-type')
      subOperator.value = data.Operator !== null && data.Operator !== undefined ? processOperator(data.Operator) : processOperator('Equals')

      let subValue = row.querySelector('.subcriteria-value')
      subValue.value = data.Value !== null && data.Value !== undefined ? data.Value.toString() : ''

      let fieldType = evalmenuType(subField.value)
      let rowTypeOpts = subField.classList.contains('field') 
            ? subOperator.parentElement.querySelectorAll('.compareType > option')
            : subOperator.parentElement.querySelectorAll('.subcriteria-type > option')
        rowTypeOpts.forEach(opt => {
            if(opt.classList.contains(fieldType)) {
                opt.style.display = "block"
            }
            else {
                opt.style.display = "none"
            }
        })
  }
  
  function loadApplication(type, data) {
    let targetFields = null;
    let subOptions = null;
    switch(type.toLowerCase()) {
        case "removeincentive": 
            document.getElementById('changeOptions').value = 'RI'
            break;
        case "addincentive": 
            document.getElementById('changeOptions').value = 'AI'
            break;
        case "addbanner":
            document.getElementById('changeOptions').value = 'AB'			
            break;
        case "addoption": 
            document.getElementById('changeOptions').value = 'AO'
            break;
        case "addphoto":
            document.getElementById('changeOptions').value = 'AP'
            break;
        case "changefield": 
            document.getElementById('changeOptions').value = 'CF'
            break;
        case "changeprice":
            switch(data.Field) {
                case "ExtraPrice1": 
                    document.getElementById('changeOptions').value = 'CP'
                break
                case "ExtraPrice2": 
                    document.getElementById('changeOptions').value = 'CA'
                break
                case "List": 
                    document.getElementById('changeOptions').value = 'CM'
                break
                case "Special": 
                    document.getElementById('changeOptions').value = 'CD'
                break
                default: break
            }
            
            break;
        default: break;
      }	
      
      switch(document.getElementById('changeOptions').value) {
          case "AI": 
              targetFields = document.querySelectorAll('.addIncentive')
              break;
          case "AO":
                targetFields = document.querySelectorAll('.option')
              break;
          case "AP":
                targetFields = document.querySelectorAll('.photo')
                break;
          case "CF": 
              targetFields = document.querySelectorAll('.changeField')
              subOptions = document.querySelectorAll('.field.sub-options')
              
              break;
          case "CP": 
          case "CM":
          case "CD":
          case "CA":
              targetFields = document.querySelectorAll('.changePrice')
              subOptions = document.querySelectorAll('.price.sub-options')
              
              break;
          case "AB": 
              targetFields = document.querySelectorAll('.ribbon')
              break;
          default:
              targetFields = null;
              break;
      }

      if(targetFields !== null) {
        if(type.toLowerCase() === 'addincentive') {
            targetFields.forEach(function (field, idx) {
            field.style.display = 'inline-block'
            field.querySelector('input').value = data.Value[field.querySelector('input').id] != undefined ? data.Value[field.querySelector('input').id] : ''
            })
        }
        else if(type.toLowerCase() === 'addbanner') {
            
            let bannerInputsTextColor = targetFields[0].querySelectorAll('input');
            let bannerInputsText = targetFields[1].querySelectorAll('input');
            let bannerInputsBgColor = targetFields[2].querySelectorAll('input');
            let bannerInputsPlacement = targetFields[3].querySelectorAll('option')
            let bannerInputsPlacementSelect = targetFields[3].querySelectorAll('select')
            bannerInputsTextColor[0].value = data.Value.textColor;
            bannerInputsText[0].value = data.Value.text;
            bannerInputsBgColor[0].value = data.Value.bgColor;
            bannerInputsPlacement[0].value =  data.Value.placement;
            bannerInputsPlacementSelect[0].value =  data.Value.placement;
            targetFields.forEach(function (field, idx) {
                field.style.display = 'inline-block'
            })
            if(data.Value.placement === 'top'){
                bannerInputsPlacementSelect[0].selectedIndex = 0
                //bannerInputsPlacementSelect[0].value =  data.Value.placement;
            }else if(data.Value.placement === 'bottom'){
                bannerInputsPlacementSelect[0].selectedIndex = 3
               // bannerInputsPlacementSelect[0].value =  data.Value.placement;
            }else if(data.Value.placement === 'diagLeft'){
                bannerInputsPlacementSelect[0].selectedIndex = 1
                //bannerInputsPlacementSelect[0].value =  data.Value.placement;
            }else if(data.Value.placement === 'diagRight'){
                bannerInputsPlacementSelect[0].selectedIndex = 2
                // bannerInputsPlacementSelect[0].value =  data.Value.placement;
            }
        }
        else {
            if(Array.isArray(data.Value)) {
                targetFields.forEach(function (field, idx) {
                field.style.display = 'inline-block'
                if(field.querySelectorAll('input').length > 0) {
                    field.querySelector('input').value = data.Value[idx]
                }
                else if (field.querySelectorAll('select').length > 0) {
                    field.querySelector('select').value = data.Value[idx]

                }
                })
            }
            else {
                if(data.Category === "Pricing") {
                    targetFields.forEach(function (field, idx) { 
                        field.style.display = 'inline-block' 
                    })
                    targetFields[0].value = data.Function === "Math" ? data.Value > 0 ? "I" : "D" : "S"
                    targetFields[1].querySelector('input').value = data.Value > 0 ? data.Value.toString() : (data.Value*-1).toString()
                }
                else {
                    targetFields.forEach(function (field, idx) { 
                        field.style.display = 'inline-block'
                        if(field.querySelectorAll('input').length > 0) {
                            field.querySelector('input').value = data.Value
                        }
                        else if(field.querySelectorAll('option').length > 0) {
                            field.value = translateObj(data.Field)
                        }
                    })
                }
            }
        }
    }
  }

  function populateDropdown(select) {
    optionList.forEach(item => {
        let opt = document.createElement('option')
        opt.value = item.name
        opt.text = item.name
        select.appendChild(opt)
    })
  }
  function populateSubCriteriaDropdown(select) {
    optionList.forEach(item => {
        let opt = document.createElement('option')
        opt.value = item.name
        opt.text = item.name
        select.appendChild(opt)
    })
  }
  function addRuleRow(type) {
  
      let exList = document.getElementById('excludes-cont')
      let newRow = criteriaRow()
      exList.appendChild(newRow)
      
      return exList.children[exList.children.length - 1]
  }
  
  function addSubcriteria(element) {
      let parent = element.parentElement
      let list = parent.querySelector('.subcriteria-list')
      
      let subRow = list.appendChild(subcriteriaRow())
      return subRow
  }
  
  function criteriaRow() {
      //row element
      let newRow = document.createElement('div')
      newRow.classList.add('rule-exclude')
  
      //top row
      let topRow = document.createElement('div')
      topRow.classList.add('toprow')
  
      //inside top row
      let fieldCont = document.createElement('div')
      fieldCont.classList.add('row-cont')
  
      let checkRow = newRow.querySelector('input.value');

      //remove button
      let removeRowBtn = document.createElement('button')
      removeRowBtn.innerHTML = '&#8861'
      removeRowBtn.classList.add('remove-row')
      removeRowBtn.classList.add('btn')
      removeRowBtn.classList.add('btn-danger')	
      removeRowBtn.onclick = function() {
        removeExcludeRow(this)
      }
  
      //dropdown for field
      let field = document.createElement('select')
      field.classList.add('field')
      field.classList.add('inputDropdown')
      field.addEventListener("change", (e) => {onChangeRow(e.target)})
      populateDropdown(field)
      
      field.remove(0);
      
      //dropdown for compare type
      let compareType = document.createElement('select')
      compareType.classList.add('compareType')
      compareType.classList.add('inputDropdown')
      compareType.addEventListener("change", (e) => {onChangeRow(e.target)})
  
      //options for compare type dropdown
      let equals = document.createElement('option')
      equals.classList.add('number')
      equals.classList.add('string')
      equals.classList.add('bool')
      equals.value = "equals"
      equals.text = "Equals"
      compareType.appendChild(equals)
  
      let greaterThan = document.createElement('option')
      greaterThan.classList.add('number')
      greaterThan.value = "greater"
      greaterThan.text = "Greater Than"
      compareType.appendChild(greaterThan)
  
      let lessThan = document.createElement('option')
      lessThan.classList.add('number')
      lessThan.value = "less"
      lessThan.text = "Less Than"
      compareType.appendChild(lessThan)
      
      let contains = document.createElement('option')
      contains.classList.add('string')
      contains.value = "contains"
      contains.text = "Contains"
      compareType.appendChild(contains)
      compareType.querySelector('option[value="contains"]').style.display = "none"

      //text field for value
      let value = document.createElement('input')
      value.setAttribute('placeholder', 'Value here')
      value.classList.add('value')
      value.classList.add('form-control')
      value.classList.add('inputTextModule')
      value.addEventListener("change", (e) => {onChangeRow(e.target)})
  
    //   //text field for value
      let boolOptionTrue = document.createElement('option');
      boolOptionTrue.value = true;
      boolOptionTrue.text = "True";
      let boolOptionFalse = document.createElement('option');
      boolOptionFalse.value = false;
      boolOptionFalse.text = "False";
      
      let boolSelect = document.createElement('select')
      boolSelect.setAttribute('placeholder', 'Value here')
      boolSelect.classList.add('value')
      boolSelect.classList.add('form-control')
      boolSelect.classList.add('inputTextModule')
      boolSelect.appendChild(boolOptionTrue)
      boolSelect.appendChild(boolOptionFalse)
      boolSelect.addEventListener("change", (e) => {onChangeRow(e.target);})

      //bottom row
      let bottomRow = document.createElement('div')
      bottomRow.classList.add('bottomRow')
  
      let criteriaList = document.createElement('div')
      criteriaList.classList.add('subcriteria-list')
    
      let addSubcriteriaBtn = document.createElement('button')
      addSubcriteriaBtn.innerHTML = "+ Add Subcriteria"
      addSubcriteriaBtn.classList.add('add-subcrit')
      addSubcriteriaBtn.onclick = function() {
        addSubcriteria(this)
    }
  
      fieldCont.appendChild(field)
      fieldCont.appendChild(compareType)

      let boolOptions = optionList.filter(item => item.type === 'bool');

      let findNameVals = boolOptions.map(({ name }) => name === field.value);
      let findNameValsBool = findNameVals.filter((b) => {
        return b === true;
      });
      
      let valSelect = newRow.querySelector('select.value');
      if(findNameValsBool.length > 0 && checkRow?.parentNode?.lastElementChild !== undefined){
        checkRow.parentNode.replaceChild(boolSelect, checkRow);
      }else if(findNameValsBool.length === 0 && valSelect !== null && valSelect.isEqualNode(boolSelect)){
        if(valSelect !== undefined){
            valSelect.parentNode.removeChild(valSelect);
            fieldCont.appendChild(value)
        };
      }
   
      fieldCont.appendChild(value)
      
    //   fieldCont.appendChild(boolSelect)
  
      topRow.appendChild(removeRowBtn)
      topRow.appendChild(fieldCont)

      bottomRow.appendChild(criteriaList)
    
    //   if(field.value !== 'All'){}
      bottomRow.appendChild(addSubcriteriaBtn)
      //add content to row
      newRow.appendChild(topRow)
      newRow.appendChild(bottomRow)
      return newRow
  }

  function changeWrapper(dd) {
    onChangeRow(dd)
  }
  
  function subcriteriaRow() {
      //main row
      let row = document.createElement('div')
      row.classList.add('criteria-row')
      let checkSubRow = row.querySelector('input.value');
      let remove = document.createElement('button')
      remove.innerHTML = '&#8861'
      remove.classList.add('remove-criteria')
      remove.classList.add('btn')
      remove.classList.add('btn-default')
      remove.onclick = function() {
            removeRow(this)
      }
      
      //label
      let label = document.createElement('label')
      label.innerHTML = 'AND'
      label.classList.add('criteria-header')
      
      //field-select
      let criteriaField = document.createElement('select')
      criteriaField.classList.add('inputDropdown')
      criteriaField.classList.add('subcriteria-field')
      criteriaField.addEventListener("change", (e) => {onChangeRow(e.target)})
    
   

      populateDropdown(criteriaField)
      
      //compareType-select
      let criteriaType = document.createElement('select')
      criteriaType.classList.add('inputDropdown')
      criteriaType.classList.add('subcriteria-type')
      criteriaType.addEventListener("change", (e) => {onChangeRow(e.target)})
      
      //compareType-options
      let equals = document.createElement('option')
      equals.classList.add('number')
      equals.classList.add('string')
      equals.classList.add('bool')
      equals.value = "equals"
      equals.text = "Equals"
      criteriaType.appendChild(equals)
  
      let greaterThan = document.createElement('option')
      greaterThan.classList.add('number')
      greaterThan.value = "greater"
      greaterThan.text = "Greater Than"
      criteriaType.appendChild(greaterThan)
  
      let lessThan = document.createElement('option')
      lessThan.classList.add('number')
      lessThan.value = "less"
      lessThan.text = "Less Than"
      criteriaType.appendChild(lessThan)
      
      let contains = document.createElement('option')
      contains.classList.add('string')
      contains.value = "contains"
      contains.text = "Contains"
      contains.style.display = "none"
      criteriaType.appendChild(contains)
      
      let valSelect = row.querySelector('select.value');
      
      let toggleInput = checkSubRow? checkSubRow:valSelect

      let boolOptionTrue = document.createElement('option');
      boolOptionTrue.value = true;
      boolOptionTrue.text = "True";
      let boolOptionFalse = document.createElement('option');
      boolOptionFalse.value = false;
      boolOptionFalse.text = "False";
      
      let boolSelect = document.createElement('select')
      boolSelect.setAttribute('placeholder', 'Value here')
      boolSelect.classList.add('value')
      boolSelect.classList.add('form-control')
      boolSelect.classList.add('inputTextModule')
      boolSelect.appendChild(boolOptionTrue)
      boolSelect.appendChild(boolOptionFalse)
      boolSelect.addEventListener("change", (e) => {onChangeRow(e.target);})
      //value-input
      let criteriaVal = document.createElement('input')
      criteriaVal.classList.add('inputTextModule')
      criteriaVal.classList.add('subcriteria-value')
      criteriaVal.classList.add('form-control')
      criteriaVal.addEventListener("change", (e) => {onChangeRow(e.target)})
      criteriaField.remove(0);
      
      let boolOptions = optionList.filter(item => item.type === 'bool');
      
      let findNameVals = boolOptions.map(({ name }) => name === criteriaField.value);
      let findNameValsBool = findNameVals.filter((b) => {
        return b === true;
      });
      let newRow = row;
  
      if(findNameValsBool.length > 0 && criteriaVal.parentElement.lastElementChild !== undefined){
        newRow.removeChild(criteriaVal);
        newRow.appendChild(boolSelect)
      }else if(findNameValsBool.length === 0 && valSelect !== null && valSelect.isEqualNode(boolSelect)){
        if(valSelect !== undefined){
            valSelect.parentNode.removeChild(valSelect);
            newRow.appendChild(criteriaVal)
        };
      }
      row.appendChild(remove)
      row.appendChild(label)
      row.appendChild(criteriaField)
      row.appendChild(criteriaType)
      row.appendChild(criteriaVal)
      
      return row
  
  }
  
  function removeRow(button) {
      button.parentElement.remove();
  }
  function removeExcludeRow(button) {
      button.parentElement.parentElement.remove();
  }
  
  function selectFields(element) {
      //change-field addIncentive
      let allFields = document.querySelectorAll('.change-field')
      let subOptions = document.querySelectorAll('.sub-options')
      let selectVal = element.value
  
      //hide all fields 
      allFields.forEach(element => element.style.display = 'none')
      subOptions.forEach(element => element.style.display = 'none')
  
      switch(selectVal) {
      case "AI":
          //show specific fields to this
          let ai = document.querySelectorAll('.addIncentive')
          ai.forEach(element => element.style.display = 'inline-block')
          break;
      case "CF":
          //show specific fields to this
          let so3 = document.querySelectorAll('.field.sub-options')
          so3.forEach(element => element.style.display = 'inline-block')
          
          let cf = document.querySelectorAll('.changeField')
          cf.forEach(element => element.style.display = 'inline-block')
          break
      case "CP":
      case "CM":
      case "CD":
      case "CA":
          //show specific fields to this
          let so = document.querySelectorAll('.price.sub-options')
          so.forEach(element => element.style.display = 'inline-block')
          
          let cp = document.querySelectorAll('.changePrice')
          cp.forEach(element => element.style.display = 'inline-block')
          break;
      case "AB":
          //show specific fields to this
          let cr = document.querySelectorAll('.ribbon')
          cr.forEach(element => element.style.display = 'inline-block')
          break;
      case "AO":
          //show specific fields to this
          let ao = document.querySelectorAll('.option')
          ao.forEach(element => element.style.display = 'inline-block')
          break;
      case "AP":
          //show specific fields to this
          let ap = document.querySelectorAll('.photo')
          ap.forEach(element => element.style.display = 'inline-block')
          break;
      case "RI": break;
      case "I":
      case "D":
      case "S":
          //show specific fields to this
          let so2 = document.querySelectorAll('.price.sub-options')
          so2.forEach(element => element.style.display = 'inline-block')
          
          let cp2 = document.querySelectorAll('.changePrice')
          cp2.forEach(element => element.style.display = 'inline-block')
          break;
  
      default:
          let so4 = document.querySelectorAll('.field.sub-options')
          so4.forEach(element => element.style.display = 'inline-block')
      
          let fv = document.querySelectorAll('.changeField')
          fv.forEach(element => element.style.display = 'inline-block')
          break;
      }
      
      
      //TODO: Switch price change logic to sub-menu select first so that user doesn't get confused by conflicting fields.
  }
  
  function onChangeRow(dropdown,  DealerID) {
      //gather all valid include rows
      let rawIncludeRows = document.querySelectorAll('.rule-include')
      let validIncludeRows = []
      let includeField = document.querySelector('#include-field');

      //handle operator dropdown values
      if(dropdown.classList.contains('field') || dropdown.classList.contains('subcriteria-field')) {
        let fieldType = evalmenuType(dropdown.value)
        let rowTypeOpts = dropdown.classList.contains('field') 
            ? dropdown.parentElement.querySelectorAll('.compareType > option')
            : dropdown.parentElement.querySelectorAll('.subcriteria-type > option')
        
        
        if(includeField.value !== 'All'){
            dropdown.parentElement.querySelectorAll('.compareType').forEach(opt => { opt.style.display = 'block'})
            document.querySelectorAll('.add-subcrit')[0].style.display = 'block';
            rowTypeOpts.forEach(opt => {
        
                if(opt.classList.contains(fieldType) ) {
                    opt.style.display = "block"
                }
                else {
                    opt.style.display = "none"
                }
            })
          
        }else{
            document.querySelectorAll('.add-subcrit')[0].style.display = 'none';
            dropdown.parentElement.querySelectorAll('.compareType').forEach(opt => { opt.style.display = 'none'})
          
        }

        //change value to neutral equals only if the type has changed
        let operatorValue = dropdown.classList.contains('field') 
            ? dropdown.parentElement.querySelector('.compareType')
            : dropdown.parentElement.querySelector('.subcriteria-type')
        if(!operatorValue.querySelector("[value="+ operatorValue.value + "]").classList.contains(fieldType)) {
            operatorValue.value = 'equals'
        }
      }
    //handle operator dropdown values
    if(dropdown.classList.contains('subcriteria-value')) {
                    
        let booloptionselect = dropdown.querySelectorAll('option')

        if(dropdown.value === 'False'){
            dropdown.selectedIndex = 1
            booloptionselect[1].selected = true;
        }else{
            dropdown.selectedIndex = 0;
            booloptionselect[0].selected = true;
        }
    }    
      rawIncludeRows.forEach(row => {
          let checkRow = row.querySelector('input.value');

          let subList = row.querySelector('.bottomRow > .subcriteria-list' );
        
          if(subList === null){
            let recreateSubCri = document.createElement('div');
            recreateSubCri.classList.add('subcriteria-list')
            row.querySelector('.bottomRow').appendChild(recreateSubCri)
          }
          let subRow = subList?.querySelectorAll('.criteria-row' );

          subRow.forEach(criList =>{
            let criListDrop = criList.querySelector('.inputDropdown.subcriteria-field');
            let criListVal = criList.querySelector('.subcriteria-value.form-control');
            let criSelect = criList.querySelector('select.subcriteria-value');

            let subCrivalue = document.createElement('input')
            subCrivalue.setAttribute('placeholder', 'Value here')
            subCrivalue.classList.add('subcriteria-value')
            subCrivalue.classList.add('form-control')
            subCrivalue.classList.add('inputTextModule')
            subCrivalue.addEventListener("change", (e) => {onChangeRow(e.target)})



            let subboolOptionTrue = document.createElement('option');
            subboolOptionTrue.value = "True";
            subboolOptionTrue.text = "True";

            let subboolOptionFalse = document.createElement('option');
            subboolOptionFalse.value = "False";
            subboolOptionFalse.text = "False";

            if(dropdown.classList.contains('subcriteria-value')) {
                if(criSelect.value === 'False'){
                
                    subboolOptionTrue.selected = false;
                    subboolOptionFalse.selected = true;
                }else{

                    subboolOptionTrue.selected = true;
                    subboolOptionFalse.selected = false;
                }        

            } 
            let subboolSelect = document.createElement('select')
            subboolSelect.setAttribute('placeholder', 'Value here')
            subboolSelect.classList.add('subcriteria-value')
            subboolSelect.classList.add('form-control')
            subboolSelect.classList.add('inputTextModule')
            subboolSelect.appendChild(subboolOptionTrue)
            subboolSelect.appendChild(subboolOptionFalse)
            subboolSelect.addEventListener("change", (e) => {onChangeRow(e.target);})
            let boolOptions = optionList.filter(item => item.type === 'bool');
           
            let subfindNameVals = boolOptions.map(({ name }) => name === criListDrop.value);
            let subfindNameValsBool = subfindNameVals.filter((b) => {
              return b === true;
            });
            if(subfindNameValsBool.length > 0 && criListVal?.parentElement.lastElementChild !== undefined){
                criList.removeChild(criListVal);
                criList.appendChild(subboolSelect)
              }else if(subfindNameValsBool.length === 0 && criSelect !== null && criSelect.isEqualNode(subboolSelect)){
                if(criSelect !== undefined){
                    criSelect.parentNode.removeChild(criSelect);
                    criList.appendChild(subCrivalue)
                };
              }
            }
        )
      

        if(checkRow !== null){checkRow.disabled = false;}
          
          //text field for value
          let value = document.createElement('input')
          value.setAttribute('placeholder', 'Value here')
          value.classList.add('value')
          value.classList.add('form-control')
          value.classList.add('inputTextModule')
          value.addEventListener("change", (e) => {onChangeRow(e.target)})

          let dropDownSelect = row.querySelector('#include-field');

          let boolOptionTrue = document.createElement('option');
          boolOptionTrue.value = true;
          boolOptionTrue.text = "True";
          let boolOptionFalse = document.createElement('option');
          boolOptionFalse.value = false;
          boolOptionFalse.text = "False";
          
          let boolSelect = document.createElement('select')
          boolSelect.setAttribute('placeholder', 'Value here')
          boolSelect.classList.add('value')
          boolSelect.classList.add('form-control')
          boolSelect.classList.add('inputTextModule')
          boolSelect.appendChild(boolOptionTrue)
          boolSelect.appendChild(boolOptionFalse)
          boolSelect.addEventListener("change", (e) => {onChangeRow(e.target);})

          let boolOptions = optionList.filter(item => item.type === 'bool');

          let findNameVals = boolOptions.map(({ name }) => name === dropDownSelect.value);
          let findNameValsBool = findNameVals.filter((b) => {
            return b === true;
          });
          
          let valSelect = row.querySelector('select.value');
          let newRow = row.querySelector('.toprow .row-cont');
          if(findNameValsBool.length > 0 && checkRow?.parentNode?.lastElementChild !== undefined){
            checkRow.parentNode.replaceChild(boolSelect, checkRow);
          }else if(findNameValsBool.length === 0 && valSelect !== null && valSelect.isEqualNode(boolSelect)){
            if(valSelect !== undefined){
                valSelect.parentNode.removeChild(valSelect);
                newRow.appendChild(value)
            };
          }
          
          if(includeField.value === 'All'){
            // validIncludeRows.push(row)
            checkRow.field = 'DealerID';
            checkRow.value =  DealerID;
            checkRow.style.display = 'none';
            checkRow.disabled = true
            if(subRow !== (null || undefined)){
                subRow.forEach(sub=>{removeRow(sub);})
            }
          }else{
            if(checkRow !== null){
                checkRow.style.display = 'block';
                if(checkRow.value === (DealerID || undefined))checkRow.value = '';
            }
          }
          if(checkRow !== null){
            if(checkRow.value !== null && checkRow.value !== '') {
                validIncludeRows.push(row)
            }else{
                checkRow.value = '';
            }
          }
      })
      //gather all valid exclude rows
      let rawExcludeRows = document.querySelectorAll('.rule-exclude')
      let validExcludeRows = []
      rawExcludeRows.forEach(subrow => {
          let checkSubRow = subrow.querySelector('input.value');
          let dropDownSelectSub = subrow.querySelector('select.field.inputDropdown');
     
          let valSelect = subrow.querySelector('select.value');
          let toggleInput = checkSubRow? checkSubRow:valSelect
          //text field for value
          let value = document.createElement('input')
          value.setAttribute('placeholder', 'Value here')
          value.classList.add('value')
          value.classList.add('form-control')
          value.classList.add('inputTextModule')
          value.addEventListener("change", (e) => {onChangeRow(e.target)})

          let boolOptionTrue = document.createElement('option');
          boolOptionTrue.value = true;
          boolOptionTrue.text = "True";
          let boolOptionFalse = document.createElement('option');
          boolOptionFalse.value = false;
          boolOptionFalse.text = "False";
          
          let boolSelect = document.createElement('select')
          boolSelect.setAttribute('placeholder', 'Value here')
          boolSelect.classList.add('value')
          boolSelect.classList.add('form-control')
          boolSelect.classList.add('inputTextModule')
          boolSelect.appendChild(boolOptionTrue)
          boolSelect.appendChild(boolOptionFalse)
          boolSelect.addEventListener("change", (e) => {onChangeRow(e.target);})

          
          let checkParent = checkSubRow? checkSubRow.parentElement:valSelect.parentElement;

          let compareElement = checkParent.querySelectorAll('.compareType')
          compareElement.forEach(item => {item.style.display = 'block'});

          let boolOptions = optionList.filter(item => item.type === 'bool');

          let findNameVals = boolOptions.map(({ name }) => name === dropDownSelectSub.value);
          let findNameValsBool = findNameVals.filter((b) => {
            return b === true;
          });
          
          let newRow = subrow.querySelector('.toprow .row-cont');
          let newSubRow = subrow.querySelector('.bottomRow');
          let subCritList = newSubRow.querySelectorAll('.subcriteria-list .criteria-row');

          subCritList.forEach(criList =>{
                let criListDrop = criList.querySelector('.inputDropdown.subcriteria-field');
                let criListVal = criList.querySelector('.subcriteria-value.form-control');
                let criSelect = criList.querySelector('select.subcriteria-value');

                let subCrivalue = document.createElement('input')
                subCrivalue.setAttribute('placeholder', 'Value here')
                subCrivalue.classList.add('subcriteria-value')
                subCrivalue.classList.add('form-control')
                subCrivalue.classList.add('inputTextModule')
                subCrivalue.addEventListener("change", (e) => {onChangeRow(e.target)})

                let subboolOptionTrue = document.createElement('option');
                subboolOptionTrue.value = "True";
                subboolOptionTrue.text = "True";
                let subboolOptionFalse = document.createElement('option');
                subboolOptionFalse.value = "False";
                subboolOptionFalse.text = "False";
                
                if(dropdown.classList.contains('subcriteria-value') && criSelect) {
                    if(criSelect.value === "False"){
                    
                        subboolOptionTrue.selected = false;
                        subboolOptionFalse.selected = true;
                    }else{
    
                        subboolOptionTrue.selected = true;
                        subboolOptionFalse.selected = false;
                    }        
    
                } 

                let subboolSelect = document.createElement('select')
                subboolSelect.setAttribute('placeholder', 'Value here')
                subboolSelect.classList.add('subcriteria-value')
                subboolSelect.classList.add('form-control')
                subboolSelect.classList.add('inputTextModule')
                subboolSelect.appendChild(subboolOptionTrue)
                subboolSelect.appendChild(subboolOptionFalse)
                subboolSelect.addEventListener("change", (e) => {onChangeRow(e.target); })


                let boolOptions = optionList.filter(item => item.type === 'bool');

                let subfindNameVals = boolOptions.map(({ name }) => name === criListDrop.value);
                let subfindNameValsBool = subfindNameVals.filter((b) => {
                  return b === true;
                });
                if(subfindNameValsBool.length > 0 && criListVal?.parentElement.lastElementChild !== undefined){
                    criList.removeChild(criListVal);
                    criList.appendChild(subboolSelect)
                  }else if(subfindNameValsBool.length === 0 && criSelect !== null && criSelect.isEqualNode(subboolSelect)){
                    if(criSelect !== undefined){
                        criSelect.parentNode.removeChild(criSelect);
                        criList.appendChild(subCrivalue)
                    };
                  }
            }
          )
    
          if(findNameValsBool.length > 0 && checkSubRow?.parentElement.lastElementChild !== undefined){
            newRow.removeChild(checkSubRow);
            newRow.appendChild(boolSelect)
          }else if(findNameValsBool.length === 0 && valSelect !== null && valSelect.isEqualNode(boolSelect)){
            if(valSelect !== undefined){
                valSelect.parentNode.removeChild(valSelect);
                newRow.appendChild(value)
            };
          }
          toggleInput.style.display = 'block';
        if(toggleInput.value !== null && toggleInput.value !== '') {
            validExcludeRows.push(subrow)
        }else{
          
          console.log(subrow);
        }
    })
          
      //process each row to value array
      let rules = []
  
      if(validIncludeRows.length > 0) {
          validIncludeRows.forEach(row => {
              let list = row.querySelector('.subcriteria-list')
              let criteria = list !== (undefined || null)? list.querySelectorAll('.criteria-row') : []
              
              let criteriaList = getSubcriteria(criteria)
              
              let vals = rowToObject("include", row, criteriaList)
              if(vals.field === 'All'){
                vals.field = 'DealerID'
              }
              rules.push(vals)
          })
      }
      if(validExcludeRows.length > 0) {
          validExcludeRows.forEach(row => {
              let list = row.querySelector('.subcriteria-list')
              let criteria = list !== undefined ? list.querySelectorAll('.criteria-row') : []
              
              let criteriaList = getSubcriteria(criteria)
              
              let vals = rowToObject("exclude", row, criteriaList)
              if(vals.field === 'All'){
                vals.field = 'DealerID'
              }
              rules.push(vals)
          })
      }
      //TODO: use rules object
      //else nothing
  }
  
  function getSubcriteria(criteria) {
      let criteriaList = []
      if(criteria.length > 0) {
          criteria.forEach(condition => {
              let critField = condition.querySelector('.subcriteria-field').value
              let critType = condition.querySelector('.subcriteria-type').value
              let critVal = condition.querySelector('.subcriteria-value').value
              
              let subcriteria = {
                  field: critField,
                  compareType: critType,
                  value: critVal
              }
              criteriaList.push(subcriteria)
          })
      }
      return criteriaList
  }
  
  function rowToObject(type, row, subcriteria) {
      let params = row.querySelector('.row-cont').children
      let field = params[0].value
      let operator = params[1].value
      let val = '';
      if(field == 'DealerID'){
        val = params[2].value
      }else{
        val = params[2].value
      }
      let obj = {
          ruleType: type,
          field: field,
          operator: operator,
          value: val,
          subcriteria: subcriteria !== null ? subcriteria : []
      }
      return(obj) 
  }
  
  function processOperator(value) {
      switch(value) { 
      case "Equals": 
          return "equals"
          break;
      case "GreaterThan": 
          return "greater"
          break;
      case "LessThan": 
          return "less"
          break;
      case "Contains": 
          return "contains"
          break;
      default: break;
      }
  
  }
  
  function getApplication() {
      let ddVal = document.getElementById('changeOptions')?.value;
      let translatedDD = ''
      let values = []
      
      switch(ddVal) {
      case "AI":
          let ai = document.querySelectorAll('.addIncentive')
          ai.forEach(element => element.children[1].value !== '' ? values.push(element.children[1].value) :  values.push(''))
          translatedDD = 'addIncentive'
          break
      case "RI":
          translatedDD = 'removeIncentive'
          break
      case "CF":
          let so3 = document.querySelectorAll('.field.sub-options')
          so3.forEach(element => element.value !== '' ? values.push(element.value) :  values.push(''))
          let cf = document.querySelectorAll('.changeField.val')
          cf.forEach(element => element.children[1].value !== '' ? values.push(element.children[1].value) :  values.push(''))
          translatedDD = 'changeField'
          break
      case "CP":
      case "CM":
      case "CD":
      case "CA":
          let so = document.querySelectorAll('.price.sub-options')
          so.forEach(element => element.value !== '' ? values.push(element.value) :  values.push(''))
          let cp = document.querySelectorAll('.changePrice.val')
          cp.forEach(element => element.children[1].value !== '' ? values.push(element.children[1].value) :  values.push(''))
          translatedDD = ddVal === "CA" ? 'changeAccessoryPrice' : ddVal === "CM" ? 'changeMSRP' : ddVal === "CD" ? 'changeSpecial' : 'changePrice'
          break
      case "AB":
          let cr = document.querySelectorAll('.ribbon')
          cr.forEach(element => element.children[1].value !== '' ? values.push(element.children[1].value) :  values.push(''))
          translatedDD = 'addBanner'
          break
      case "AO":
          //show specific fields to this
          let ao = document.querySelectorAll('.option')
          ao.forEach(element => {
           element.children[1].value !== null && element.children[1].value !== '' ?  values.push(element.children[1].value) : values.push('')
        })
          translatedDD = 'addOption'
          break
      case "AP":
          //show specific fields to this
          let ap = document.querySelectorAll('.photo')
          ap.forEach(element => {
            element.children[1].value !== '' ? values.push(element.children[1].value) : values.push('')
        })
          translatedDD = 'addPhoto'
          break
      default:
          break
      }	
      
      let func = null
      let cat = null
      let field = null
      let subfield = null
      let val = null
       
      //if changeField then Function == replace
      switch(translatedDD) {
          case "addIncentive": 
              func = "AddIncentive"
              cat = null
              field = "Object"
              subfield = null
              
              val = {
                  Name: values[0].toString(),
                  Description: values[1].toString(),
                  Price: parseInt(values[2]),
                  Priority: parseInt(values[3]),
                  StartDate: values[4].toString(),
                  EndDate: values[5].toString()
              }
          break
          case "removeIncentive": 
              func = "DisableIncentives"
              cat = null
              field = null
              subfield = null
              val = null
          break
          case "addBanner":
              func = "Append"
              cat =  "Banner"
              field = "BannerContent"
              subfield = null
              val = {
                textColor: values[0],
                text: values[1],
                bgColor: values[2],
                placement: values[3],
              }
          break
          case "changeField": 
              func = "Replace"
              cat = "VehicleInfo"
              field = translateField(values[0])
              subfield = null
              val = values[1] != undefined ? values[1] : ''
          break
          case "changePrice":
            func = values[0] === 'S' ? "Replace" : "Math"
            cat = "Pricing"
            field = "ExtraPrice1"
            subfield = null
            val = values[0] === 'S' ? values[1] : (values[0] === 'I' ? values[1] : (values[1]*-1))
          break
          case "changeMSRP":
            func = values[0] === 'S' ? "Replace" : "Math"
            cat = "Pricing"
            field = "List"
            subfield = null
            val = values[0] === 'S' ? values[1] : (values[0] === 'I' ? values[1] : (values[1]*-1))
            translatedDD = "changePrice"
          break
          case "changeAccessoryPrice":
            func = values[0] === 'S' ? "Replace" : "Math"
            cat = "Pricing"
            field = "ExtraPrice2"
            subfield = null
            val = values[0] === 'S' ? values[1] : (values[0] === 'I' ? values[1] : (values[1]*-1))
            translatedDD = "changePrice"
          break
          case "changeSpecial":
            func = values[0] === 'S' ? "Replace" : "Math"
            cat = "Pricing"
            field = "Special"
            subfield = null
            val = values[0] === 'S' ? values[1] : (values[0] === 'I' ? values[1] : (values[1]*-1))
            translatedDD = "changePrice"
          break
          case "addOption": 
              func = "AddOption"
              cat = null
              field = "Object"
              subfield = null
              val = values[0]
          break
          case "addPhoto": 
              func = "AddPhoto"
              cat = null
              field = "Object"
              subfield = null
              val = values
          break
          default: break
      }

      let appData = {
          Type: translatedDD,
          Function: func,
          Category: cat,
          Field: field,
          Subfield: subfield,
          Value: val
      }
      return appData
  
  }
  
  function populateChangeFields() {
      let dd = document.querySelector('.field.sub-options')
      let allRemoved = optionList.filter(item => item.name !== 'All' && item.name !== 'Price');
      allRemoved.forEach(item => {
        let opt = document.createElement('option')
        opt.value = item.name
        opt.text = item.name
        dd.appendChild(opt)
    })
    //   populateDropdown(dd)
  }

  function disableButton() {
    let btn = document.getElementById('update')
    btn.setAttribute('disabled', true)
    btn.innerHTML = 'Saving...'
  }

  function enableButton() {
    let btn = document.getElementById('update')
    btn.removeAttribute('disabled')
    btn.innerHTML = 'Set Rule'   
  }
  
  
  function update(siteID, rule, DealerID, order, openFunc, history) {
      //check update dropdown dealerID, siteID, order, ruleID
      //assemble field data
      //build object - ?
      //send
      disableButton();
      let rawIncludeRows = document.querySelectorAll('.rule-include');
      let validIncludeRows = [];
      rawIncludeRows.forEach(row => {
          let inputVal = row.querySelector('input.value');
          let selectVal = row.querySelector('select.value');
          let checkRow = inputVal? inputVal:selectVal;
          if(checkRow?.value === 'All' && checkRow?.value !== ''){
            validIncludeRows.push(row)
          }
          if(checkRow.value !== null && checkRow.value !== '') {
              validIncludeRows.push(row)
          }
      })
      //gather all valid exclude rows
      let rawExcludeRows = document.querySelectorAll('.rule-exclude');
      let validExcludeRows = [];
      rawExcludeRows.forEach(row => {
        let inputVal = row.querySelector('input.value');
        let selectVal = row.querySelector('select.value');
        let checkRow = inputVal? inputVal:selectVal;
          if(checkRow.value !== null && checkRow.value !== '') {
              validExcludeRows.push(row)
          }
      })
          
      //process each row to value array
      let rules = [];
      if(validIncludeRows.length > 0) {
          validIncludeRows.forEach(row => {
              let list = row.querySelector('.subcriteria-list')
              let criteria = list !== undefined ? list.querySelectorAll('.criteria-row') : []
              
              let criteriaList = getSubcriteria(criteria)
              
              let vals = rowToObject("include", row, criteriaList, DealerID)
              rules.push(vals)
          })
      }
      if(validExcludeRows.length > 0) {
          validExcludeRows.forEach(row => {
              let list = row.querySelector('.subcriteria-list')
              let criteria = list !== undefined ? list.querySelectorAll('.criteria-row') : []
              
              let criteriaList = getSubcriteria(criteria)
              
              let vals = rowToObject("exclude", row, criteriaList, DealerID)
              rules.push(vals)
          })
      }
      let processedRules = buildCriteria(rules, DealerID)
      let appData = getApplication()
      let ruleObj = {
        DealerID: DealerID, //dealerID,//Sent in from list page
        RuleID: rule? rule.RuleID : "", //Sent in from list page
        Order: rule? rule.Order : order, //Sent in from list page
        Type: appData.Type,
        Title: document.querySelector('#ruleName')?.value.toString(),
        Criteria: processedRules,
        Application: {
            Function: appData.Function,
            Category: appData.Category,
            Field: appData.Field,
            Subfield: appData.Subfield,
            Value: appData.Value
            }
        }
        axios.post(`${process.env.API}/api/inventory/${siteID}/${DealerID}/createInventoryRule`, {
            rulesToSave: [ruleObj]
        })
        .then(d => {
            let newData = JSON.parse(d.data.Payload);
            openFunc()
            enableButton()
            history.push({
                pathname: `/app/main/sites/${siteID}/rules/`,
               // state: {} //NEED TO SET CURRENT DEALERREF IN STATE TO GO BACK TO THAT DEALERS ID
            })
        })
        .catch(err => {
            console.log(err);
            openFunc(true)
        })
  }
  
  function buildCriteria(list, DealerID){
      let crit = []
      list.forEach(item => {
          let critObj = {
            RuleType: item.ruleType === 'include' ? 'Inclusion' : 'Exclusion',
            Category: null,
            Field: null,
            Subfield:null,
            Operator: null,
            Value: null,
            subCriteria: []
          }
          //if operator is >, <, ==
              //check that value can be cast to integer
              //else use 0	
          if( item.operator === "less" || item.operator === "greater") {
              critObj.Value = parseInt(item.value) !== NaN ? parseInt(item.value) : 0
          }
          //if operator is contains, value must be string
          else if(item.operator === "contains") {
              critObj.Value = item.value.toString() !== undefined ? item.value.toString() : ''
          }
          else if(evalType(item.field) === 'number'){
            critObj.Value = parseInt(item.value) !== NaN ? parseInt(item.value) : 0 
          }
          else {
            critObj.Value = item.value.toString() !== undefined ? item.value.toString() : ''
          }
          
          switch(item.operator) {
              case "less": 
                  critObj.Operator = "LessThan" 
                  break
              case "greater": 
                  critObj.Operator = "GreaterThan" 
                  break
              case "equals": 
                  critObj.Operator = "Equals" 
                  break
              case "contains": 
                  critObj.Operator = "Contains" 
                  break
              default: 
                  break
          }
          if(item.field === 'All'){
            critObj.Category = 'VehicleInfo'
            critObj.Field = 'DealerID'//? double check
            critObj.Value = DealerID
          }else if(item.field === 'Price') {
              critObj.Category = 'Pricing'
              critObj.Field = 'ExtraPrice1' //? double check
          }
          else {
              critObj.Category = 'VehicleInfo'
              critObj.Field = translateField(item.field)
          }
          if(item.value === 'true'){
            item.value = true;
            critObj.Value = true;
          }
          if(item.value === 'false'){
            item.value = false;
            critObj.Value = false;
          }
          if(item.subcriteria.length > 0) {
              critObj.subCriteria = subCriteriaItem(item.subcriteria)
          }
          crit.push(critObj)
      })
      return crit
  }
  
  function translateField(val) {
      let item = optionList.find(element => element.name === val)
      return item.translation
  }

  function translateObj(val) {
    let item = optionList.find(element => element.translation === val)
    return item.name
  }

  function evalType(val) {
    let item = optionList.find(element => element.name === val)
    return item.type !== undefined ? item.type : 'string'
  }
  
  function  subCriteriaItem(list) {
      let subCrit = []
      list.forEach(item => {
          let critObj = {
            RuleType: item.ruleType === 'include' ? 'Inclusion' : 'Exclusion',
            Category: null,
            Field: null,
            Subfield:null,
            Operator: null,
            Value: null
          }
          //if operator is >, <, ==
              //check that value can be cast to integer
              //else use 0	
          if(item.compareType === "less" || item.compareType === "greater") {
              critObj.Value = parseInt(item.value) !== NaN ? parseInt(item.value) : 0
          }
          //if operator is contains, value must be string
          else if(item.compareType === "contains" || item.compareType === "equals") {
              critObj.Value = item.value.toString() !== undefined ? item.value.toString() : ''
          }
          
          switch(item.compareType) {
              case "equals": 
                  critObj.Operator = "Equals"
                  break
              case "less": 
                  critObj.Operator = "LessThan"
                  break
              case "greater": 
                  critObj.Operator = "GreaterThan"
                  break
              case "contains": 
                  critObj.Operator = "Contains"
                  break
              default: break
          }
          if(item.value === 'true'){
            item.value = true;
            critObj.Value = true;
          }
          if(item.value === 'false'){
            item.value = false;
            critObj.Value = false;
          }
          if(item.field === 'price') {
              critObj.Category = 'Pricing'
              critObj.Field = 'ExtraPrice1' //? double check
          }
          else {
              critObj.Category = 'VehicleInfo'
              critObj.Field = translateField(item.field) //need translation function for values
          }
          subCrit.push(critObj)
      })
      return subCrit
  }
  
// export default RuleEdit;

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

export default withRouter(connect(mapStateToProps)(RuleEdit));
