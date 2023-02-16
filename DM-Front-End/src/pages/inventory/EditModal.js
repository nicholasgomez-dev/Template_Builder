import React, { Fragment } from 'react';
import axios from 'axios';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Form, Label, Input, UncontrolledCarousel } from 'reactstrap';
import undoArrow from '../../images/icons/undoArrow.svg';
import Loader from '../../components/Loader/Loader';
import modalStyles from './Inventory.modules.scss';


class EditModal extends React.Component {
    
    constructor() {
      super();

      this.state = {
        modalIsOpen: false,
        vehiclePhotos: [],
        vehicleData: [],
        landingData: [],
        itemRules: [],
        adjustedVehicle: [],
        newRules: [],
        rulesFound: '',
        isHidden: false,
        isLoading: false,
        saveInProgress: false
      };

      this.errorHandler = this.errorHandler.bind(this);
      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.handleResetClick = this.handleResetClick.bind(this);
      this.saveButtonClick = this.saveButtonClick.bind(this);
      this.handleValueChange = this.handleValueChange.bind(this);
      this.sendNewData = this.sendNewData.bind(this);
      this.toggleHide = this.toggleHide.bind(this);
    }


    //Error Handling
    errorHandler() {
      this.setState({
        error: true
      })
    }

    applyChanges(vehicleObject, rulesObject) {
      const newPricing = {};

      Object.keys(vehicleObject).forEach(price => newPricing[price] = (rulesObject.hasOwnProperty(price) ? rulesObject[price] : vehicleObject[price]))
      
      let mergedVehiclePricing = {...this.state.vehicleData}
      mergedVehiclePricing.Pricing =  newPricing

      console.log(JSON.stringify(this.state.itemRules))

      if (this.state.itemRules.Rules.Replace.VehicleInfo.VehicleStatus === "_hidden") {
        mergedVehiclePricing.VehicleInfo.VehicleStatus = "_hidden"
        this.setState(() => {
          return { isHidden: true }
        })
      }

      this.setState({ adjustedVehicle: mergedVehiclePricing, isLoading: false })
    }

    sendNewData() {
      const newVehicleData = {...this.state.adjustedVehicle}
      newVehicleData.Pricing = this.state.newRules.Rules.Replace.Pricing
      newVehicleData.VehicleInfo.VehicleStatus = this.state.newRules.Rules.Replace.VehicleInfo.VehicleStatus

      this.setState({ isLoading: true, modalIsOpen: false, saveInProgress: false })
      this.props.newVehicleData(newVehicleData)
    }

    async queryInventoryItem() {
      return new Promise((resolve, reject) => {
  
        this.setState({ isLoading: true })
        axios.get(process.env.API + '/api/inventory/' + this.props.siteID + '/' + this.props.row.VIN + '/getLandingInventoryItem')
        .then(async res => {
          
          this.setState(() => {
            return { vehicleData: res.data, landingData: res.data }
          })

          return axios.get(process.env.API + '/api/inventory/' + this.props.siteID + '/' + this.props.row.VIN + '/getInventoryItemRules')
        })
        .then(res => {
          if(res.data.Items.length > 0) {

            console.log('Rules found.')
            this.setState(() => {
              return { itemRules: res.data.Items[0], newRules: res.data.Items[0], rulesFound: true}
            })
            this.applyChanges(this.state.vehicleData.Pricing, this.state.itemRules.Rules.Replace.Pricing)

            return resolve()
          }

          let emptyRulesObject =  { "Rules":{ "Replace":{ "Pricing":{}, "VehicleInfo":{} }}, "VIN": this.state.vehicleData.VIN, "DealerID":this.state.vehicleData.DealerID }

          console.log('No rules found. Adding rules object template...')
          this.setState(() => {
            return { 
              isLoading: false,
              adjustedVehicle: this.state.vehicleData,
              newRules: emptyRulesObject,
              itemRules: emptyRulesObject,
              rulesFound: false,
              isHidden: this.state.vehicleData.VehicleInfo.VehicleStatus === "_hidden" ? true : false
            }
          })

          resolve()
        })
        .catch(err => {
          this.errorHandler()
          
          reject(err)
        })
      })
    }

    //Get data on modal open
    openModal(row) {
      this.queryInventoryItem()
      let photos = row.ListOfPhotos.map(item => ({src: item.PhotoUrl, key: item.VehiclePhotoID, captionText:  'Slide ' + String(item.Order), altText: 'Slide ' + String(item.Order)}))

      this.setState(() => {
        return {
          modalIsOpen: true,
          isLoading: true,
          vehiclePhotos: photos
        }
      })
    }

    //Close modal only
    closeModal() { this.setState({ modalIsOpen: false, newRules: this.state.itemRules }); }
    
    //Default value needs to be value from Landing object
    handleResetClick(e) {
      const input = e.target.previousElementSibling;
      input.value = this.state.landingData.Pricing[input.id];
      let ruleChanges = Object.assign({}, this.state.newRules);
      ruleChanges.Rules.Replace.Pricing[input.id] = parseFloat(input.value);
      this.setState({ newRules: ruleChanges })
      console.log('Value reset to: ' + input.value)
    }

    //Handle Cost Change
    handleValueChange(e) {
      let ruleChanges = Object.assign({}, this.state.newRules);
      ruleChanges.Rules.Replace.Pricing[e.target.id] = parseFloat(e.target.value);
      this.setState({ newRules: ruleChanges })
    }

    toggleHide(e) {
      this.setState({ isHidden: (e.currentTarget.checked ? true : false) }, () => {
        let ruleChanges = Object.assign({}, this.state.newRules);
        ruleChanges.Rules.Replace.VehicleInfo['VehicleStatus'] = this.state.isHidden ? '_hidden' : 'In Stock';
        this.setState({ newRules: ruleChanges })
      })
    }

    //Save button click
    async saveButtonClick() {
      if (this.state.itemRules === this.state.newRules) {
        
        return this.setState({ modalIsOpen: false, newRules: this.state.itemRules}, () => this.closeModal())
      }

      this.setState({saveInProgress: true}, () => {
        console.log('Saving changes...');
      });

        return new Promise((resolve, reject) => {

          if(Object.keys(this.state.newRules.Rules.Replace.Pricing).length === 0) {
            let ruleChanges = Object.assign({}, this.state.newRules);
            ruleChanges.Rules.Replace.Pricing = this.state.vehicleData.Pricing;
            this.setState({ newRules: ruleChanges })
          }

          if(Object.keys(this.state.newRules.Rules.Replace.VehicleInfo).length === 0) {
            let ruleChanges = Object.assign({}, this.state.newRules);
            ruleChanges.Rules.Replace.VehicleInfo['VehicleStatus'] = this.state.vehicleData.VehicleInfo.VehicleStatus;
          }

          let requestObj = this.state.newRules

          axios.put(process.env.API + '/api/inventory/' + this.props.siteID + '/' + 'putVehicleRules/', requestObj)
          .then(res => {

            this.sendNewData()

            resolve()
          })
          .catch(err => {
            this.errorHandler()
            
            reject(err)
          })
        })

    }

    render() {
      let {row} = this.props;

      return (
        <div>
          <Button className="table__button" color="info" block onClick={() => this.openModal(row)}>Edit</Button>
          <Modal className="`modalStyles[modal]`" isOpen={this.state.modalIsOpen} style={{maxWidth: '450px', width: '100%'}}>
            <ModalHeader>Edit Vehicle</ModalHeader>
            {!this.state.isLoading ?
            <ModalBody className="bg-white vehicle__edit">
              <Form id="myForm">
              <Row>
                  <Label md={{ size: 6, offset: 3 }} className="text-center" style={{textAlign: 'center !important', fontSize: '1.5em', fontWeight: 'bolder', margin: '0 auto 7px auto'}} >
                    {this.state.vehicleData.VehicleInfo ? this.state.vehicleData.VehicleInfo.Year + " " : ""}
                    {this.state.vehicleData.VehicleInfo ? this.state.vehicleData.VehicleInfo.Make + " " : ""}
                    {this.state.vehicleData.VehicleInfo ? this.state.vehicleData.VehicleInfo.Model + " " : ""}
                  </Label>
                </Row> 
                <FormGroup row>
                  <Col md={{ size: 10, offset: 1 }}><UncontrolledCarousel autoPlay={false} interval={false} items={this.state.vehiclePhotos} /> </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="vehicleMsrp" md={4} className="text-md-right">Sales Price</Label>
                  <Col md={6}>
                    <div className="input__flex">
                      <Input type="text" id="ExtraPrice1" defaultValue={this.state.adjustedVehicle.Pricing ? this.state.adjustedVehicle.Pricing.ExtraPrice1 : ""} onChange={(e) => this.handleValueChange(e)}/>
                      {this.state.adjustedVehicle.Pricing ?
                        <Fragment>
                          {this.state.adjustedVehicle.Pricing.ExtraPrice1 !== this.state.landingData.Pricing.ExtraPrice1 ? <img src={undoArrow} className="input__reset" alt="Undo changes" onClick={this.handleResetClick}/> : '' }
                        </Fragment> 
                      : ''}
                    </div>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md={{size: 7, offset: 5}}>
                    <Input type="checkbox" id="is-hidden" checked={this.state.isHidden} onChange={this.toggleHide}/>Hide Vehicle in Inventory
                  </Col>
                </FormGroup>
              </Form>
            </ModalBody> : <Loader size={75}/> }
            <ModalFooter>
            {!this.state.saveInProgress ?
              <Fragment>
                <Button color="default" onClick={this.closeModal}>Cancel</Button> 
                <Button color="info" onClick={() => this.saveButtonClick()}>Save Vehicle</Button>
              </Fragment>
              : <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>}
            </ModalFooter>
          </Modal>
        </div>
      )
    }
}


export default(EditModal);