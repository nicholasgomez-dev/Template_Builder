import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Col, Row, Progress } from 'reactstrap';

import Widget from '../../components/Widget';
import Trend from 'react-trend';
import MainChart from './components/Charts/MainChart';
import TaskContainer from './components/TaskContainer/TaskContainer';
import BigStat from './components/BigStat/BigStat';
import TableContainer from './components/TableContainer/TableContainer';
import Calendar from '../dashboard/components/calendar/Calendar';
import HighchartsReact from 'highcharts-react-official';
import API from 'actions/portalAPI';

import PulseLoader from "react-spinners/PulseLoader";
import { css } from "@emotion/core";
import mock from './mock';
import s from './Analitycs.module.scss';
import { receiveDataRequest } from '../../actions/analytics';
import Loader from "../../components/Loader";
import { useHistory } from "react-router-dom";

    const override = css`
      display: flex;
      justify-content: center;
      padding: 300px;
      width: 100%;
    `;  



class Analytics extends Component {
  
  constructor(props) {
      super(props);
      this.state = {
	  sites: [],
          loading: true,
	  isDataFetched: false,  	  
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


    donut = () => {
      let series = [
        {
          name: 'Revenue',
          data: this.props.revenue.map(s => {
            return {
              name: s.label,
              y: s.data
            }
          })
        }
      ];
      return {
        chart: {
          type: 'pie',
          height: 120,
          backgroundColor: 'rgba(0,0,0,0)',
        },
        credits: {
          enabled: false
        },
        title: false,
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false
            },
            borderWidth: 0,
            showInLegend: true,
            innerSize: 60,
            size: 100,
            states: {
              hover: {
                halo: {
                  size: 1
                }
              }
            }
          }
        },
        colors: ['#FD5F00', '#4d8cb9', '#1A86D0'],
        legend: {
          align: 'right',
          verticalAlign: 'middle',
          layout: 'vertical',
          itemStyle: {
            color: '#788898',
            fontWeight: 400,
          },
          itemHoverStyle: {
            color: "#cccccc"
          },
          itemMarginBottom: 5,
          symbolRadius: 0
        },
        exporting: {
          enabled: false
        },
        series
      };
    }

  componentDidMount() {

	const tokenAuth = { access_token: 'A9D9PYfZZvK_A2zag_Mi2ypIl-pmr0QI' };
	API.post('/api/sites/fetch-sites/', {tokenAuth} )
	    .then(res => {
		const sites = res.data;
    console.log(sites)
    if (sites.length == 1){
      
      this.props.history.push("/app/main/sites/" + sites[0]._id + '/landing')
    }
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
      const { visits, isReceiving, performance, server, mainChart } = this.props;

    if(!this.state.isDataFetched) {
    return (
        <div>
        <h1 className="page-title">Your Sites</h1>
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
        <h1 className="page-title">Your Sites</h1>
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
            <TableContainer data={mock.table} sites={this.state.sites} />
                </Widget>
              </Col>
            </Row>
          </div>
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

export default connect(mapStateToProps)(Analytics);
