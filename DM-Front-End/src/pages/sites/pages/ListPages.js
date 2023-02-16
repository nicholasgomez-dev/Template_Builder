import React from 'react';
import { Link, useHistory } from "react-router-dom";
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Progress,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap';

import {
  BootstrapTable,
  TableHeaderColumn,
} from 'react-bootstrap-table';
import PublishAllButton from '../../../components/UI/Buttons/publishAllButton';
import PublishButton from '../../../components/UI/Buttons/publishButton';
import Loader from '../../../components/Loader/Loader'
import s from './ListPages.modules.scss';
import AddPageModal from './addPageModal';

class ListPages extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dealership: "",
      siteType: "",
      pages: [],
      isLoading: false,
      templatePages: [],
      isPublished: true //default until loaded
    };
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.errorHandler = this.errorHandler.bind(this);
  }
  async componentDidMount() {
    await this.checkSiteInfo()
  }
  errorHandler() {
    this.setState({
      error: true
    })
  }

  openModal(template) {
    this.setState({
      modal: true,
      templateOpened: template
    })
  }

  closeModal(name) {
    this.setState({
      [name]: false
    })
  }

  // This will be used to get the siteName and alreadySelected once the backend API (dmwp-93) is merged into development
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
            siteType: response.data.siteMetadata.siteType
          })
          return axios.get(process.env.API + `/api/templates/${response.data.siteMetadata.currentTemplateID}/pages`)
        })
        .then(templatePagesData => {
          console.log(templatePagesData)
          this.setState({ templatePages: templatePagesData.data, isLoading: false })
          resolve()
        })
        .catch(err => {
          if (err.response) {
            // console.log(err.response.data)
          } else if (err.request) {
            console.log(err.request)
          }
          this.errorHandler()
          this.setState({ isLoading: false })
          reject(err)
        })

    })
  }
  renderSizePerPageDropDown = (props) => {
    const limits = [];
    props.sizePerPageList.forEach((limit) => {
      limits.push(<DropdownItem key={limit} onClick={() => props.changeSizePerPage(limit)}>{limit}</DropdownItem>);
    });

    return (
      <Dropdown isOpen={props.open} toggle={props.toggleDropDown}>
        <DropdownToggle color="default" caret>
          {props.currSizePerPage}
        </DropdownToggle>
        <DropdownMenu>
          {limits}
        </DropdownMenu>
      </Dropdown>
    );
  };

  createCustomInsertButton = () => {
    console.log('hello')
    return (
      // <button>test</button>
      <AddPageModal sitePages={this.state.pages} pages={this.state.templatePages} history={this.props.history} handleErrors={this.errorHandler} siteID={this.props.match.params.site_id} templateID={this.state.templateID} />
      
    );
  }

  render() {
    const options = {
      insertBtn: this.createCustomInsertButton,
      sizePerPage: 10,
      paginationSize: 3,
      sizePerPageDropDown: this.renderSizePerPageDropDown,
      noDataText: (this.state.isLoading) ? <Loader size={75}/> : "No Pages Found",
    };
    const  site_id = this.props.match.params.site_id;
    function infoFormatter(cell) {
      return (
        <div>
          <small>
            Type:&nbsp;<span className="fw-semi-bold">{cell.type}</span>
          </small>
          <br />
          <small>
            Dimensions:&nbsp;<span className="fw-semi-bold">{cell.dimensions}</span>
          </small>
        </div>
      );
    }
    function linkFormatter(id) {
      return (<button className="btn"><Link to={`/app/main/sites/${site_id}/pages/${id}`}>Edit Page</Link></button>)
    }

    function descriptionFormatter(cell) {
      return (
        <button className="btn-link">
          {cell}
        </button>
      );
    }

    function progressFormatter(cell) {
      return (
        <Progress style={{ height: '15px' }} color={cell.type} value={cell.progress} />
      );
    }
    
    function dateFormatter(cell) {
      return `${new Date(cell).toDateString()}`;
    }
    function getEmailFromUserDetails(data) {
      return `${data.nickname}`;
    }
    function progressSortFunc(a, b, order) {
      if (order === 'asc') {
        return a.status.progress - b.status.progress;
      }
      return b.status.progress - a.status.progress;
    }

    function dateSortFunc(a, b, order) {
      if (order === 'asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return (
      <div>
        <h2 className="page-title">Page List - <span className="fw-semi-bold">{this.state.dealership}</span></h2>
        <div style={{ "margin": "0 0 10px","display": "flex", "justifyContent": "flex-end" }}>
          {((this.state.siteType == 'Master') && !this.state.isLoading) ? <PublishAllButton isPublished={this.state.isPublished} site_id={this.props.match.params.site_id} toolTipDirection="left-start" /> : ""}
          {!this.state.isLoading ? <PublishButton isPublished={this.state.isPublished} site_id={this.props.match.params.site_id} toolTipDirection="left-start" /> : ""}
        </div>
        { !this.state.isLoading && this.state.pages.length > 0 ?
          <BootstrapTable responsive data={this.state.pages} version="4" pagination options={options} insertRow={(!this.state.error && !this.state.isLoading && this.state.templateID) ? true : false} search tableContainerClass={`table-striped table-hover ${s.bootstrapTable}`}>
            <TableHeaderColumn className={`${s.columnHead}`} dataField="pageTitle" dataSort>
              <span className="fs-sm">Page Name</span>
            </TableHeaderColumn>
            <TableHeaderColumn className={`${s.columnHead}`} dataFormat={descriptionFormatter} dataField="slug" >
              <span className="fs-sm">Page Path</span>
            </TableHeaderColumn>
            <TableHeaderColumn className={`d-md-table-cell ${s.columnHead}`} columnClassName="d-md-table-cell" dataField="pageType" datasort>
              <span className="fs-sm">Page Type</span>
            </TableHeaderColumn>
            <TableHeaderColumn className={`d-md-table-cell ${s.columnHead}`} columnClassName="d-md-table-cell" dataField="dateCreated" dataFormat={dateFormatter} dataSort>
              <span className="fs-sm">Date Created</span>
            </TableHeaderColumn>
            <TableHeaderColumn className={`d-md-table-cell ${s.columnHead}`} columnClassName="d-md-table-cell" dataField="createdBy" dataFormat={getEmailFromUserDetails}>
              <span className="fs-sm">Created By</span>
            </TableHeaderColumn>
            <TableHeaderColumn className={`d-md-table-cell ${s.columnHead}`} columnClassName="d-md-table-cell" dataField="dateEdited" dataFormat={dateFormatter} dataSort>
              <span className="fs-sm">Date Edited</span>
            </TableHeaderColumn>
            <TableHeaderColumn className={`d-md-table-cell ${s.columnHead}`} columnClassName="d-md-table-cell" dataField="lastEditedBy" dataFormat={getEmailFromUserDetails} dataSort>
              <span className="fs-sm">Last Edited By</span>
            </TableHeaderColumn>
            <TableHeaderColumn className={`d-sm-table-cell ${s.columnHead}`} columnClassName="d-sm-table-cell" dataField="_id" dataFormat={linkFormatter} isKey>
              <span className="fs-sm">Edit Page</span>
            </TableHeaderColumn>

          </BootstrapTable>
          : <Loader size={75}/>
        }
        <Modal centered={true} isOpen={this.state.error}>
          <ModalHeader toggle={() => this.closeModal('error')}>Error</ModalHeader>
          <ModalBody className="bg-white">
            <div className="youSure">Oops, something went wrong, please try again.</div>
          </ModalBody>
          <ModalFooter>
            <Button color="gray" onClick={() => this.closeModal('error')}>Close</Button>
          </ModalFooter>
        </Modal>

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

export default withRouter(connect(mapStateToProps)(ListPages));
