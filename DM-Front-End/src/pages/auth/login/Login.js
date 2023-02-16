import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import config from '../../../config';
import { connect } from 'react-redux';
import { Container, Alert, Button } from 'reactstrap';
import Widget from '../../../components/Widget';
import { loginUser, receiveToken, doInit } from '../../../actions/auth';
import jwt from "jsonwebtoken";
import microsoft from '../../../images/microsoft.png';
import { push } from 'connected-react-router';
import axios from 'axios';

class Login extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    };

    static isAuthenticated() {
      const token = axios.defaults.headers.common['Authorization'];
      if (!config.isBackend && token) return true;
      if (!token) return;
      const date = new Date().getTime() / 1000;
      const data = jwt.decode(token.split(" ")[1]);
      if (!data) return;
      return date < data.exp;
    }

    constructor(props) {
        super(props);

        this.state = {
          email: '',
          password: '',
        };

        this.doLogin = this.doLogin.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }


    doLogin(e) {
        e.preventDefault();
        this.props.dispatch(loginUser({ email: this.state.email, password: this.state.password }));
    }

    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        const token = params.get('token');
        if (token) {
            this.props.dispatch(receiveToken(token));
            this.props.dispatch(doInit());
        }
    }

    changeEmail(event) {
        this.setState({ email: event.target.value });
    }

    changePassword(event) {
        this.setState({ password: event.target.value });
    }

    render() {
        return (
            <div className="auth-page">
                <Container>
                    <h5 className="auth-logo">
                        <i className="la la-circle text-primary" />
                        Dealer Masters
                        <i className="la la-circle text-danger" />
                    </h5>
                    <Widget className="widget-auth mx-auto" title={<h3 className="mt-0">Login</h3>}>
                        <p className="widget-auth-info">
                            Use your email to sign in.
                        </p>

                        <form className="mt" onSubmit={this.doLogin}>
                            {
                                this.props.errorMessage && (
                                    <Alert className="alert-sm" color="danger">
                                        {this.props.errorMessage}
                                    </Alert>
                                )
                            }
                            <div className="form-group auth-log-in">
                                <input className="form-control no-border" value={this.state.email} onChange={this.changeEmail} type="email" required name="email" placeholder="Email" />
                            </div>
                            <div className="form-group mb-0 auth-log-in">
                                <input className="form-control no-border" value={this.state.password} onChange={this.changePassword} type="password" required name="password" placeholder="Password" />
                            </div>
                            <Link className="d-block text-right mb-3 mt-1 fs-sm" to="forgot">Forgot password?</Link>
                            <Button type="submit" color="info" className="auth-btn mb-3" size="sm">{this.props.isFetching ? 'Loading...' : 'Login'}</Button>
                        </form>

                    </Widget>
                </Container>
                <footer className="auth-footer">
                  {new Date().getFullYear()} &copy; Dealer Masters.
                </footer>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isFetching: state.auth.isFetching,
        isAuthenticated: state.auth.isAuthenticated,
        errorMessage: state.auth.errorMessage,
    };
}

export default withRouter(connect(mapStateToProps)(Login));

