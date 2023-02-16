import * as dataFormat from 'components/Users/list/UsersDataFormatters';
import actions from '../../../actions/usersListActions';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import API from 'actions/portalAPI';
import axios from 'axios';

import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

import PulseLoader from "react-spinners/PulseLoader";
import { css } from "@emotion/core";

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import Widget from 'components/Widget';

import s from '../Users.module.scss';


const override = css`
      display: flex;
      justify-content: center;
      width: 100%;
    `;

class UsersListTable extends Component {

  state = {
    deleteModalOpen: false,
    idToDelete: null,
    idToReset: null,
    resetPwordModalOpen: false,
    resetPwordModalButtonContent: "Reset",
    messageModalOpen: false,
    messageModalContent: "",
    deleteModalButtonContent: "Delete",
    users: [],
    loading: true,
    isDataFetched: false,
  }

  async handleDelete() {
    this.setState({ "deleteModalButtonContent": "Deleting..." });
    var url = `/api/users/${this.state.idToDelete}/toggle_activation`;
    const resp = await axios.post(url);
    if (resp["status"] == 200) {
      this.setState({
        "messageModalOpen": false,
        "deleteModalOpen": false,
        "deleteModalButtonContent": "Delete"
      });
      var modifiedUsers = [];
      for (var i = 0; i < this.state.users.length; i++) {
        if (this.state.users[i]["_id"] != this.state.idToDelete) { modifiedUsers.push(this.state.users[i]); }
      }
      this.setState({ users: modifiedUsers });
    } else {
      this.setState({
        "messageModalContent": "Are you sure you want to delete this user? This action cannot be undone",
        "messageModalOpen": true,
        "deleteModalOpen": false,
        "deleteModalButtonContent": "Delete"
      });

    }
  }

  openDeleteModal(uidtodel) {
    this.setState({
      "deleteModalOpen": true,
      "idToDelete": uidtodel,
      "deleteModalButtonContent": "Delete",
    });
  }

  closeDeleteModal() {
    this.setState({ "deleteModalOpen": false });
  }

  openMessageModal() {
    this.props.dispatch(actions.doOpenMessageModal());
  }

  closeMessageModal() {
    this.setState({ "messageModalOpen": false });
  }

  openMessageModal() {
    this.props.dispatch(actions.doOpenMessageModal());
  }

  closeMessageModal() {
    this.setState({ "messageModalOpen": false });
  }

  async handleReset() {
    this.setState({ "resetPwordModalButtonContent": "Resetting..." });
    var post_params = { "user_hash_id": this.state.idToReset };
    var url = `/api/users/initialize_password_reset_email`;
    const resp = await axios.post(url, post_params);
    if (resp["status"] == 200) {
      this.setState({
        "messageModalContent": "This users password has been reset. They should receive an email with reset instructions.",
        "messageModalOpen": true,
        "resetPwordModalOpen": false,
        "resetPwordModalButtonContent": "Reset"
      });
    } else {
      this.setState({
        "messageModalContent": "Sorry something went wrong. Please try again.",
        "messageModalOpen": true,
        "resetPwordModalOpen": false,
        "resetPwordModalButtonContent": "Reset"
      });
    }
  }

  openResetPwordModal(uidtodel) {
    this.setState({ idToReset: uidtodel, resetPwordModalOpen: true });
  }


  closeResetPwordModal() {
    this.setState({ resetPwordModalOpen: false })
  }

  actionFormatter(cell) {
    return (
      <div className={`d-flex justify-content-between`}>
        <Button
          className={s.controBtn}
          color="success"
          size="xs"
          onClick={() => this.props.dispatch(push(`/admin/users/${cell}/edit`))}
        >
          Assign Sites

      </Button>
        <Button
          className={s.controBtn}
          color="info"
          size="xs"
          onClick={() => this.openResetPwordModal(cell)}
        >
          Reset Password
        </Button>
        <Button
          className={s.controBtn}
          color="danger"
          size="xs"
          onClick={() => this.openDeleteModal(cell)}
        >
          Delete
        </Button>
      </div>
    )
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

  componentDidMount() {
    API.post('/api/users/fetch-users/')
      .then(res => {
        var modified_users = [];
        for (var i = 0; i < res.data.body.length; i++) {
          if (res.data.body[i]["status"] == "active") {
            modified_users.push(res.data.body[i]);
          }
        }
        this.setState({ users: modified_users, isDataFetched: true })
        console.log(this.state.users)
      })
  };

  loadingUsers() {
    if (this.state.isDataFetched) {
      return "No users found";
    } else {
      return (
        <PulseLoader
          css={override}

          size={15}
          color={"#e9ecef"}
          loading={this.state.loading}
        />
      );
    }
  };


  render() {
    const rows = this.state.users;
    const options = {
      sizePerPage: 10,
      paginationSize: 5,
      sizePerPageDropDown: this.renderSizePerPageDropDown,
      noDataText: this.loadingUsers(),
    };

    return (
      <div>
        <Widget title="Users" collapse close>
          <div className={s.usersTableWrapper}>
            <BootstrapTable bordered={false} data={rows} version="4" pagination options={options} search tableContainerClass={`table-responsive table-striped table-hover ${s.usersListTableMobile}`}>

              <TableHeaderColumn dataField="name" dataSort>
                <span className="fs-sm">Name</span>
              </TableHeaderColumn>

              <TableHeaderColumn dataField="email_address" dataSort>
                <span className="fs-sm">E-mail</span>
              </TableHeaderColumn>

              <TableHeaderColumn dataField="type" dataSort>
                <span className="fs-sm">Role</span>
              </TableHeaderColumn>

              <TableHeaderColumn isKey dataField="_id" dataFormat={this.actionFormatter.bind(this)}>
                <span className="fs-sm">Actions</span>
              </TableHeaderColumn>
            </BootstrapTable>
          </div>
        </Widget>

        <Modal size="sm" isOpen={this.state.messageModalOpen} toggle={() => this.closeMessageModal()}>
          <ModalHeader toggle={() => this.closeMessageModal()}>Pword Reset Response</ModalHeader>
          <ModalBody className="bg-white">{this.state.messageModalContent}</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.closeMessageModal()}>Ok</Button>
          </ModalFooter>
        </Modal>

        <Modal size="sm" isOpen={this.state.resetPwordModalOpen} toggle={() => this.closeResetPwordModal()}>
          <ModalHeader toggle={() => this.closeResetPwordModal()}>Confirm Pword Reset</ModalHeader>
          <ModalBody className="bg-white">
            Are you sure you want to reset the password for this user?
            </ModalBody>
          <ModalFooter>
            <Button color="#ecf0f1" onClick={() => this.closeResetPwordModal()}>Cancel</Button>
            <Button color="primary" onClick={() => this.handleReset()}>{this.state.resetPwordModalButtonContent}</Button>
          </ModalFooter>
        </Modal>

        <Modal size="sm" isOpen={this.props.modalOpen} toggle={() => this.closeModal()}>

          <Modal size="sm" isOpen={this.state.deleteModalOpen} toggle={() => this.closeDeleteModal()}>

            <Modal size="sm" isOpen={this.state.messageModalOpen} toggle={() => this.closeMessageModal()}>
              <ModalHeader toggle={() => this.closeMessageModal()}>Pword Reset Response</ModalHeader>
              <ModalBody className="bg-white">{this.state.messageModalContent}</ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={() => this.closeMessageModal()}>Ok</Button>
              </ModalFooter>
            </Modal>

            <Modal size="sm" isOpen={this.state.resetPwordModalOpen} toggle={() => this.closeResetPwordModal()}>
              <ModalHeader toggle={() => this.closeResetPwordModal()}>Confirm Pword Reset</ModalHeader>
              <ModalBody className="bg-white">
                Are you sure you want to reset the password for this user?
            </ModalBody>
              <ModalFooter>
                <Button color="#ecf0f1" onClick={() => this.closeResetPwordModal()}>Cancel</Button>
                <Button color="primary" onClick={() => this.handleReset()}>{this.state.resetPwordModalButtonContent}</Button>
              </ModalFooter>
            </Modal>

            <Modal size="sm" isOpen={this.props.modalOpen} toggle={() => this.closeModal()}>

              <Modal size="sm" isOpen={this.state.deleteModalOpen} toggle={() => this.closeDeleteModal()}>

                <ModalHeader toggle={() => this.closeModal()}>Confirm delete</ModalHeader>
                <ModalBody className="bg-white">
                  Are you sure you want to delete this user?
            </ModalBody>
                <ModalFooter>
                  <Button color="#ecf0f1" onClick={() => this.closeDeleteModal()}>Cancel</Button>
                  <Button color="primary" onClick={() => this.handleDelete()}>{this.state.deleteModalButtonContent}</Button>
                </ModalFooter>
              </Modal>
            </Modal>
          </Modal>
          </Modal>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
          loading: store.users.list.loading,
    rows: store.users.list.rows,
    modalOpen: store.users.list.modalOpen,
    idToDelete: store.users.list.idToDelete,
  };
}

export default connect(mapStateToProps)(UsersListTable);
