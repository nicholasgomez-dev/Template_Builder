import React, {Fragment} from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Row, Col, Button } from 'reactstrap';
import s from './Inventory.modules.scss';
import Loader from '../../components/Loader/Loader';
import EditModal from './EditModal'
import Placeholder from '../../images/placeholders/placeholder.png'

class InventoryTable extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        dealership: "",
        tableData: [],
        isLoading: false,
        templatePages: [],
        isPublished: true,
        changesStaged: false,
        siteID: "",
        saveSuccessful: false,
        publishInProgress: false
      };

      this.errorHandler = this.errorHandler.bind(this);
      this.updateTableData = this.updateTableData.bind(this);
      this.handlePublishClick = this.handlePublishClick.bind(this);
    }

    updateTableData = (vehicleChanges) => {
      const tableDataVar = this.state.tableData

      let foundItem = tableDataVar.findIndex(obj => obj.VIN == vehicleChanges.VIN)
      tableDataVar[foundItem].Pricing = vehicleChanges.Pricing
      tableDataVar[foundItem].VehicleInfo.VehicleStatus = vehicleChanges.VehicleInfo.VehicleStatus

      this.setState({
        tableData: tableDataVar,
        changesStaged: true,
        saveSuccessful: false
      })
    }

    //Publish click handler
    async handlePublishClick() {
      this.setState({ publishInProgress: true }, () => {console.log('Publish in progress.')})
      return new Promise((resolve, reject) => {
        const lambdaResponse = axios.get(process.env.API + '/api/inventory/' + this.props.match.params.site_id + '/publishInventoryChanges')
        .then(async res => {
          console.log('Table merge complete.')

          return axios.post(process.env.API + '/api/sites/' + this.props.match.params.site_id + '/publish')
        })
        .then(res => res.status === 200 ? resolve(this.setState({saveSuccessful: true, publishInProgress: false, changesStaged: false })) : reject(alert('Something went wrong, please try again later.')))
        .catch(err => {
          reject(err)
        })
      })
    }

    
    //Functions to run on load
    async componentDidMount() {
      await this.checkSiteInfo()
      await this.queryInventoryData()
    }

    //Function running on load
    async checkSiteInfo() {
      return new Promise((resolve, reject) => {
  
        this.setState({ isLoading: true })
        const siteData = axios.get(process.env.API + '/api/sites/' + this.props.match.params.site_id + '/info')
          .then(async (response) => {
            if (!response.data.siteMetadata.currentTemplateID || response.data.siteMetadata.currentTemplateID.length < 1) { this.props.history.push(`/app/main/sites/${this.props.match.params.site_id}/selectTemplate`) }
            this.setState({
              pages: response.data.pages,
              dealership: response.data.siteMetadata.siteName,
              templateID: response.data.siteMetadata.currentTemplateID,
              isPublished: response.data.published,
              siteID: this.props.match.params.site_id
            })
            return axios.get(process.env.API + `/api/templates/${response.data.siteMetadata.currentTemplateID}/pages`)
          })
          .then(templatePagesData => {
            this.setState({ templatePages: templatePagesData.data, isLoading: false })
            resolve()
          })
          .catch(err => {
            if (err.response) {
              console.log(err.response.data)
            } else if (err.request) {
              console.log(err.request)
            }
            this.errorHandler()
            this.setState({ isLoading: false })
            reject(err)
          })
  
      })
    }
    
    //Function running on load
    async queryInventoryData() {
      return new Promise((resolve, reject) => {
        this.setState({ isLoading: true })
        axios.get(process.env.API + '/api/inventory/' + this.props.match.params.site_id + '/getInventory')
        .then(response => {
            this.setState({
              tableData: response.data,
              isLoading: false
            })
            
            resolve()
          })
          .catch(err => {
            if (err.response) {
              console.log(err.response.data)
            } else if (err.request) {
              console.log(err.request)
            }
            this.errorHandler()
            this.setState({ isLoading: false })
            reject(err)
          })
      })
    }

    //Error Handling
    errorHandler() {
      this.setState({
        error: true
      })
    }
    
    //Edit button table sub component
    editButton(cell, row) {
      return(
        <EditModal row={row} cell={cell} siteID={this.state.siteID} newVehicleData={this.updateTableData}/>
      )
    }
    
    //Table image sub component
    coverImageFormatter(cell) {
      return (
        <Fragment>
          {cell.length > 0 ? <img style={{maxWidth: '40%', objectFit: 'contain'}} src={String(cell[0].PhotoUrl)} /> : <img style={{maxWidth: '40%', objectFit: 'contain'}} src={Placeholder} />}
        </Fragment>
      )
    }
  
    render() {
      const options = {
        sizePerPage: 14,
        paginationSize: 3,
        noDataText: (this.state.isLoading) ? <Loader size={75}/> : "No Inventory Found"
      };
      
      //Vehicle Name Formatter
      function vehicleFormatter(cell) {
        return `${cell.Year} ${cell.Make} ${cell.Model} ${cell.Trim}`
      }
      
      //Stock Number Formatter
      function stockNumFormatter(cell) {
        return `${cell.StockNumber}`
      }

      //Status Formatter
      function vehicleStatusFormatter(cell) {
        if (cell.VehicleStatus === "_hidden") {
          return "Hidden"
        } else {
          return `${cell.VehicleStatus}`
        }
      }
      
      //Price Formatter
      function priceFormatter(cell) {
        return `$${cell.ExtraPrice1}`
      }
  
      return (
        <div>
          <h2 className="page-title">Inventory Manager - <span className="fw-semi-bold">{this.state.dealership}</span></h2>
          <Row>
            <Col md={10}>
              {!this.state.isLoading && this.state.changesStaged ? <p style={{color: "rgb(5,170,109)"}}>Vehicle changes saved! Click publish to make your changes live.</p> : ''}
            </Col>
            
            <Col md={2}>
              {!this.state.saveSuccessful && this.state.changesStaged ? <Button color="success" className="mb-3" block onClick={this.handlePublishClick}>{!this.state.publishInProgress ? 'Publish' : 'Publishing...'}</Button> : this.state.saveSuccessful ? <p>Changes published!</p> : ''}
            </Col>
          </Row>
          { !this.state.isLoading && this.state.tableData.length > 0 ?
            <BootstrapTable condensed responsive pagination searchPlaceholder={'Search by VIN'} data={this.state.tableData} options={options} tableContainerClass={`text-center ${s.bootstrapTable}`} search >
              <TableHeaderColumn className={`d-md-table-cell text-center align-middle`} columnClassName="d-sm-table-cell text-center align-middle" dataField="VehicleInfo" dataFormat={stockNumFormatter} isKey>
                <span className="fs-sm">Stock #</span>
              </TableHeaderColumn>
              <TableHeaderColumn className={`d-md-table-cell text-center align-middle`} columnClassName="d-sm-table-cell text-center align-middle" dataField="VIN">
                <span className="fs-sm">VIN</span>
              </TableHeaderColumn>
              <TableHeaderColumn className={`d-md-table-cell text-center align-middle`} columnClassName="d-sm-table-cell text-center align-middle" dataField="ListOfPhotos" dataFormat={this.coverImageFormatter.bind(this)}>
                <span className="fs-sm">Image</span>
              </TableHeaderColumn>
              <TableHeaderColumn className={`d-md-table-cell text-center align-middle`} columnClassName="d-md-table-cell text-center align-middle" dataField="VehicleInfo" dataFormat={vehicleFormatter}>
                <span className="fs-sm">Vehicle</span>
              </TableHeaderColumn>
              <TableHeaderColumn className={`d-sm-table-cell text-center align-middle`} columnClassName="d-sm-table-cell text-center align-middle" dataField="Pricing"  dataFormat={priceFormatter}>
                <span className="fs-sm">Sales Price</span>
              </TableHeaderColumn>
              <TableHeaderColumn className={`d-sm-table-cell text-center align-middle`} columnClassName="d-sm-table-cell text-center align-middle" dataField="VehicleInfo"  dataFormat={vehicleStatusFormatter}>
                <span className="fs-sm">Status</span>
              </TableHeaderColumn>
              <TableHeaderColumn className={`d-sm-table-cell text-center align-middle`} columnClassName="d-sm-table-cell text-center align-middle" dataField='button' dataFormat={this.editButton.bind(this)}>
                <span className="fs-sm">Edit</span>
              </TableHeaderColumn>
            </BootstrapTable>
          : (this.state.isLoading ? <Loader size={75}/> : <div>This site does not have inventory editing enabled.</div>) }
        </div>
      );
    }
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
  
export default withRouter(connect(mapStateToProps)(InventoryTable));