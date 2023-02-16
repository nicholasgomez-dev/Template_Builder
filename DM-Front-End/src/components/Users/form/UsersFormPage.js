import React, { Component } from 'react';
import UsersForm from 'components/Users/form/UsersForm';
import { push } from 'connected-react-router';
import actions from '../../../actions/usersFormActions';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import cx from 'classnames';

import s from '../Users.module.scss';

class UsersFormPage extends Component {
  state = {
    dispatched: false,
    promoAlert: false,
  };

  showPromoAlert() {
      this.setState({promoAlert: true});
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    if (this.isEditing()) {
      dispatch(actions.doFind(match.params.id));
    }
    else {
      if (this.isProfile()) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const currentUserId = currentUser.user.id;
        dispatch(actions.doFind(currentUserId));
      }
      else {
        dispatch(actions.doNew());
      }
    }
    this.setState({ dispatched: true });
    setTimeout(() => {
      this.showPromoAlert();
    }, 100);
  }

  doSubmit = (id, data) => {
    const { dispatch } = this.props;
    if (this.isEditing() || this.isProfile()) {
      dispatch(actions.doUpdate(id, data, this.isProfile()));
    } else {
      dispatch(actions.doCreate(data));
    }
  };

  isEditing = () => {
    const { match } = this.props;
    return !!match.params.id;
  };

  isProfile = () => {
    const { match } = this.props;
    return match.url === '/app/edit_profile';
  };

  render() {
    return (
      <React.Fragment>
          <div className="page-top-line">
          </div>
          {this.state.dispatched && (
            <UsersForm
              saveLoading={this.props.saveLoading}
              findLoading={this.props.findLoading}
              currentUser={this.props.currentUser}
              record={
                (this.isEditing() || this.isProfile()) ? this.props.record : {}
              }
              isEditing={this.isEditing()}
              isProfile={this.isProfile()}
              onSubmit={this.doSubmit}
            />
          )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(store) {
  return {
    findLoading: store.users.form.findLoading,
    saveLoading: store.users.form.saveLoading,
    record: store.users.form.record,
    currentUser: store.auth.currentUser,
  };
}

export default connect(mapStateToProps)(UsersFormPage);
