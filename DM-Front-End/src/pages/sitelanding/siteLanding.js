import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Progress } from 'reactstrap';

import Widget from '../../components/Widget';

import API from 'actions/portalAPI';

import PulseLoader from "react-spinners/PulseLoader";
import { css } from "@emotion/core";
import s from './siteLanding.module.scss';
import Loader from "../../components/Loader";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";
import chartIcon from '../../images/siteLandingIcons/chart.png'
import clipboardIcon from '../../images/siteLandingIcons/clipboard.png'
import folderIcon from '../../images/siteLandingIcons/folder.png'
import gearIcon from '../../images/siteLandingIcons/gear.png'
import pagesIcon from '../../images/siteLandingIcons/pages-icon.png'
import { Link, useHistory } from "react-router-dom";

const override = css`
      display: flex;
      justify-content: center;
      padding: 300px;
      width: 100%;
    `;

class SiteLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sites: [],
            loading: true,
            isDataFetched: false,
            previousViews: []
        }
    }

    static propTypes = {
        visits: PropTypes.any,
        performance: PropTypes.any,
        server: PropTypes.any,
        revenue: PropTypes.any,
        mainChart: PropTypes.any,
        isReceiving: PropTypes.bool,
        dispatch: PropTypes.func.isRequired,
    };

    static defaultProps = {
        visits: {},
        performance: {},
        server: {},
        revenue: [],
        mainChart: [],
        isReceiving: false
    };


    componentDidMount() {
        const tokenAuth = { access_token: 'A9D9PYfZZvK_A2zag_Mi2ypIl-pmr0QI' };
        if (localStorage.getItem("recentPages") && (this.props.match.params.site_id in JSON.parse(localStorage.getItem("recentPages")))){
            this.setState({previousViews: JSON.parse(localStorage.getItem("recentPages"))[this.props.match.params.site_id]})
        }
        API.post('/api/sites/fetch-sites/', {tokenAuth} )
            .then(res => {
                const sites = res.data;
                this.setState({ sites });
                this.setState({ isDataFetched: true })
                console.log(this.state.sites)
            })
            .catch(err => {
                if (err.response) {
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



    render() {
        function dateFormatter(cell) {
            return `${new Date(cell).toDateString()}`;
        }
        function linkFormatter(id) {
            console.log("the id")
            console.log(id)
            return (<button className="btn btn-blue"><Link to={`/app/main/sites/${site_id}/pages/${id}`}>Edit Page</Link></button>)
        }

        const site_id = this.props.match.params.site_id

        if(!this.state.isDataFetched) {
            return (
                <div>
                    <h1 className="page-title">Welcome to Dealer Masters</h1>
                    <div className={s.sidesWrapper}>
                        <div className={s.analyticsSide}>
                            <Row>
                                <Col xs={12} className={s.cardWrapper}>
                                    <Widget
                                        className={'pb-0'}
                                        bodyClass={`mt p-0`}
                                        title={<h4><strong></strong></h4>}
                                        style={{backgroundColor: "transparent", boxShadow: "none"}}
                                    >
                                        <Loader size={75}/>
                                    </Widget>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <h1 className="page-title">Welcome to Dealer Masters</h1>
                    <div >Account ID: <span>{this.props.match.params.site_id}</span></div>
                    <div><h2 className={`${s.section_header}`}>Site</h2></div>
                    <div>
        
                        <div className={`${s.action_card_container}`} >
                            <Link to={'/app/main/sites/' + site_id + '/pages/'}>
                                <div  className={`${s.action_card}`}>
                                <div className={`${s.action_card_header_div}`}>
                                        <h3 className={`${s.action_card_header}`}>Pages</h3>
                                        <span>Edit Your Site</span>
                                </div>
                                    <img src={pagesIcon}></img>
                                    
                                </div>
                            </Link>
                            <Link to={'/app/main/sites/' + site_id + "/settings/"}>
                                <div className={`${s.action_card}`}>
                                    <div className={`${s.action_card_header_div}`}>
                                        <h3 className={`${s.action_card_header}`}>Site Settings</h3>
                                        <span>Site-Wide Settings</span>
                                    </div>
                                    <img src={gearIcon}></img>
                                </div>
                            </Link>
                            <Link to={'/app/main/sites/' + site_id + '/navigation/'}>
                                <div className={`${s.action_card}`}>
                                    <div className={`${s.action_card_header_div}`}>
                                        <h3 className={`${s.action_card_header}`}>Navigation</h3>
                                        <span>Site Navigation</span>
                                    </div>
                                    <img src={folderIcon}></img>
                                </div>
                            </Link>
                            <Link to={'/app/main/sites/' + site_id + '/inventory/'}>
                                <div className={`${s.action_card}`}>
                                    <div className={`${s.action_card_header_div}`}>
                                        <h3 className={`${s.action_card_header}`}>Inventory</h3>
                                        <span>Edit Site Inventory</span>
                                    </div>
                                    <img src={clipboardIcon}></img>
                                </div>
                            </Link>
                            <Link to={'/app/main/sites/' + site_id + '/analytics/'}>
                                <div className={`${s.action_card}`}>
                                    <div className={`${s.action_card_header_div}`}>
                                        <h3 className={`${s.action_card_header}`}>Analytics</h3>
                                        <span>View Analytics</span>
                                    </div>
                                    <img src={chartIcon}></img>
                                </div>
                            </Link>
                        </div>

                    </div>
                    <div className={this.state.previousViews.length> 0 ? `${s.divider}` :  `${s.hidden}`}></div>
                    <div><h2 className={this.state.previousViews.length > 0 ? `${s.section_header}` : `${s.hidden}`}>YOUR RECENTLY VIEWED PAGES</h2></div>

                    <div className={this.state.previousViews.length > 0 ? '' :  `${s.hidden}`}>
                        <BootstrapTable responsive version="4"  data={this.state.previousViews}>
                            <TableHeaderColumn className={`${s.columnHead}`} dataField="pageTitle" dataSort>
                                <span className="fs-sm">Page Name</span>
                            </TableHeaderColumn>
                            <TableHeaderColumn className={`${s.columnHead}`}  dataField="pageUrl" >
                                <span className="fs-sm">Page Path</span>
                            </TableHeaderColumn>
                            <TableHeaderColumn className={`d-md-table-cell ${s.columnHead}`} columnClassName="d-md-table-cell" dataFormat={dateFormatter} dataField="dateVisited" datasort>
                                <span className="fs-sm">Date Last Visited</span>
                            </TableHeaderColumn>
                            <TableHeaderColumn className={`d-sm-table-cell ${s.columnHead}`} columnClassName="d-sm-table-cell" dataFormat={linkFormatter} dataField="pageId"  isKey>
                                <span className="fs-sm">Edit Page</span>
                            </TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        visits: state.analytics.visits,
        isReceiving: state.analytics.isReceiving,
        performance: state.analytics.performance,
        revenue: state.analytics.revenue,
        server: state.analytics.server,
        mainChart: state.analytics.mainChart,
    }
}

export default SiteLanding;
