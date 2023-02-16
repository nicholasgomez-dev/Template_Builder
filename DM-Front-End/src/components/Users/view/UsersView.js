import React, { Component, useState } from 'react';
import { useLocation } from 'react-router';
import Loader from 'components/Loader';
import TextViewItem from 'components/FormItems/items/TextViewItem';
import ImagesViewItem from 'components/FormItems/items/ImagesViewItem';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { toast } from 'react-toastify';
import PulseLoader from "react-spinners/PulseLoader";
import { css } from "@emotion/core";

import s from '../Users.module.scss';
import API from 'actions/portalAPI';
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
} from 'reactstrap';

import Widget from 'components/Widget';

const override = css`
 display: flex;
 justify-content: center;
 width: 100%;
`;

class UsersView extends Component {

    constructor(props) {
	super(props);
        const params = window.location.href.split("/");	
	this.state = {
	    sites: [],
	    userPrivilegedSites: [],
	    availableSites: [],
	    selectedSite: '',
	    user: [],
	    currentUserId: params[6],
	    setValue: '',
	    value: '',
	    loading: true,
	    isLoading: false,
	    isDataFetched: false, 	    
	    isOpen: false,
	    deleteModalOpen: false
	}
    }
    //Modal Functions
    handleOpenModal = () => {
       this.setState({ isOpen: true });
       const tokenAuth = { access_token: 'A9D9PYfZZvK_A2zag_Mi2ypIl-pmr0QI' };
       API.post('/api/sites/fetch-sites/', {tokenAuth} )
	   .then(res => {
	       const sites = res.data;
	       this.setState({ sites });
	       console.log(this.state.sites);
	       const snpID = this.state.userPrivilegedSites.map(site => site._id);	       
	       const sitesNotPrivileged = this.state.sites.filter(site => !snpID.includes(site._id));
	       this.setState({availableSites: sitesNotPrivileged})
	       console.log(this.state.availableSites)
	   })	
    };

    handleCloseModal = () => {
	this.setState({ isOpen: false });
        this.setState({ isLoading: false });
	const siteArray = this.state.sites;
	const savedSite = siteArray.find(site => site._id === this.state.selectedSite);
	console.log(savedSite);
	console.log(this.state.userPrivilegedSites.push(savedSite));
	this.forceUpdate();
    };

    handleCloseModalButton = () => {
	this.setState({ isOpen: false });    
    };
    
    //Save modal
    handleSaveModal = () => {
        this.setState({ isLoading: true });	
	API.post('/api/sites/' + this.state.selectedSite + '/users/', {
	    site_id: this.state.selectedSite,
	    user_id: this.state.currentUserId	 
	})
	.then(res => {
	    console.log(res);
	    console.log(this.state.selectedSite);
	    console.log(this.state.userPrivilegedSites);
	    toast.success( 'Site assigned to user!', {
		autoClose: 7000,
	    });
	    this.handleCloseModal();	    
	})
	.catch(err => {
          this.setState({ isLoading: false });		
	  if (err.response) {
	      toast.warning( 'Site cannot be assigned to user' );	     
	      console.log(err.response.data);
	      console.log(err.response.status);
	      console.log(err.response.headers);	 
	  } else if (err.request) {
	      console.log(err.request);
	  } else {
	      console.log('Error', err.message);
	  }
	})		
    };

    //Revoke site permissions from collaborator
    handleDeleteModal = () => {
      this.setState({ deleteModalOpen: true });	
    };

    handleDelete = () => {
        this.setState({ isLoading: true });		
	API.delete('/api/sites/' + this.state.selectedSite + '/users/' + this.state.currentUserId, {
	    site_id: this.state.selectedSite,
	    user_id: this.state.currentUserId	 
	})
	.then(res => {	
	    console.log(res)
	    const deleteSiteList = this.state.userPrivilegedSites.filter(site => site._id !== this.state.selectedSite);
	    this.setState({userPrivilegedSites: deleteSiteList});
	    toast.success( 'Site removed from user!', {
		autoClose: 7000,
	    });
	    this.handleCancelDelete();
            this.setState({ isLoading: false });	    
	})
	.catch(err => {
         this.setState({ isLoading: false });		
	 if (err.response) {
	     toast.warning( 'Delete failed' );	  
	     console.log(err.response.data);
	     console.log(err.response.status);
	     console.log(err.response.headers);	 
	 } else if (err.request) {
	     console.log(err.request);
	 } else {
	     console.log('Error', err.message);
	 }
       })
       .then(res => {
  
       const tokenAuth = { access_token: 'A9D9PYfZZvK_A2zag_Mi2ypIl-pmr0QI' };
       API.post('/api/sites/fetch-sites/', {tokenAuth} )
	   .then(res => {
	       const sites = res.data;
	       this.setState({ sites });
	       console.log(this.state.sites)
           })
       })	
    };

    handleDeleteModal = (cell) => {
	this.setState({ deleteModalOpen: true });
	this.setState({ selectedSite: cell })
	console.log(this.state.selectedSite)
    };
    handleCancelDelete = () => {
      this.setState({ deleteModalOpen: false });	
    };    


    createCustomInsertButton = (handleOpenModal) => {
      return (
	<Button color="primary" onClick={ this.handleOpenModal }>Add Site</Button>
      );
    }

    selectSite = (row) => {
	console.log(row);
	this.setState({ selectedSite: row._id });
	console.log(this.state.selectedSite);
    }
    
    //Delete button
     actionFormatter(cell) {
       return (
	 <div className={`d-flex justify-content-between`}>
	   <Button
	     className={s.controBtn}
	     color="danger"
	     size="xs"
	     onClick={() => this.handleDeleteModal(cell)}
	   >
	     Delete
	   </Button>
	 </div>
	)
     }    

     createCustomInsertButton = (handleOpenModal) => {
       return (
	 <Button color="success" onClick={ this.handleOpenModal }>Add Site</Button>
       );
     }

     selectSite = (row) => {
	  console.log(row);
	  this.setState({ selectedSite: row._id });
	  console.log(this.state.selectedSite);
     }

    componentDidMount() {	
	API.get('/api/users/' + this.state.currentUserId, )
	    .then(res  => {
             this.setState({ user: res.data })
             console.log(this.state.users)
	     const privilegedSites = this.state.user.site_privileges;
             console.log(privilegedSites);
	     this.setState({userPrivilegedSites: privilegedSites});
	     this.setState({ isDataFetched: true })
            })
    };

    loadingUsers(){ 
	 if(this.state.isDataFetched){
	       return "No sites assigned";
	  }else{
	       return(
        <PulseLoader
	  css={override}
          size={15}
          color={"#e9ecef"}
          loading={this.state.loading}
        />
	       );
	  }
    };

    customPagination() {
	if (this.state.userPrivilegedSites.length > 10) {
	    return true;
	} else {
	    return false;
	}
    };
          
    
  renderView() {
      const { record } = this.props;
      //const siteSelect = this.state;
      //console.log(this.state.siteSelect);

    const options = {
	insertBtn: this.createCustomInsertButton,
        onRowClick: this.selectSite,
        noDataText: this.loadingUsers()	
    };

    const modalOptions = {
	onRowClick: this.selectSite,
	searchPosition: 'left',
	searchWidth: '100%',
        noDataText: this.loadingUsers()	
    };
      
    const tableRowEvents = {
       onClick: (e, row, rowIndex) => {
	 console.log(`clicked on row with index: ${rowIndex}`);
       },
       onMouseEnter: (e, row, rowIndex) => {
	 console.log(`enter on row with index: ${rowIndex}`);
       }
    }

    const selectRow = {
      mode: 'radio',
      bgColor: '#bec7cf',
      clickToSelect: true
    };
      
    return (
      <Widget title={<h2>{'Edit User - Site Assignment'}</h2>} collapse close>

        <TextViewItem
          label={'Username'}
          value={this.state.user.name}
        />

        <TextViewItem
          label={'Email'}
          value={this.state.user.email_address}
        />
            <div className={s.usersTableWrapper}>
	    <br/>
	    <h4>Assigned Sites</h4>
	    <br/>
            <BootstrapTable insertRow bordered={false} data={this.state.userPrivilegedSites} options={options} version="4" search pagination={ this.customPagination() } tableContainerClass={`table-responsive table-striped table-hover ${s.usersListTableMobile}`}>

                <TableHeaderColumn width="90%" isKey dataField="sitename" dataSort>
                  <span className="fs-sm">Name</span>
                </TableHeaderColumn>
                <TableHeaderColumn dataField="_id" dataFormat={this.actionFormatter.bind(this)}>
                  <span className="fs-sm">Actions</span>
                </TableHeaderColumn>
              </BootstrapTable>
            </div>	
	    <br/>
        <Modal isOpen={this.state.isOpen} onCloseModal={this.handleCloseModalButton}>
          <ModalHeader>Select a Site</ModalHeader>
            <ModalBody className="bg-white">
	    <input placeholder="Search" className={s.assignSiteList} onChange={e => this.table.handleSearch(e.target.value)}  />
            <BootstrapTable ref={(component) => { this.table = component }} printable bordered={false} data={this.state.availableSites} selectRow={ selectRow } options={modalOptions} version="4" pagination={ this.customPagination() } tableContainerClass={`table-responsive table-hover text-wrap`}>
            <TableHeaderColumn isKey hidden={ true } dataField="_id" dataSort>
                </TableHeaderColumn>	    

                <TableHeaderColumn dataField="sitename" dataSort>
                  <span className="fs-sm">Name</span>
                </TableHeaderColumn>

              </BootstrapTable>
          </ModalBody>
          <ModalFooter>
            <Button className={s.closeButton} color="primary" onClick={this.handleCloseModalButton}>Close</Button>
            <Button color="primary" disabled={this.state.isLoading} onClick={this.handleSaveModal}>{this.state.isLoading ? 'Adding Site...' : 'Add'}</Button>
          </ModalFooter>
            </Modal>
            <Modal size="sm" isOpen={this.state.deleteModalOpen}>
            <ModalHeader toggle={() => this.handleCancelDelete()}>Confirm delete</ModalHeader>
            <ModalBody className="bg-white">
              Are you sure you want to delete this item?
            </ModalBody>
            <ModalFooter>
            <Button className={s.closeButton} color="primary" onClick={this.handleCancelDelete}>Cancel</Button>
              <Button color="primary" disabled={this.state.isLoading} onClick={this.handleDelete}>{this.state.isLoading ? 'Deleting...' : 'Delete'}</Button>
            </ModalFooter>
          </Modal>	    
	    </Widget>	    
    );    
  }

  render() {
    const { record, loading } = this.props;

    if (loading || !record) {
      return <Loader />;
    }

    return this.renderView();
  }
}

export default UsersView;
