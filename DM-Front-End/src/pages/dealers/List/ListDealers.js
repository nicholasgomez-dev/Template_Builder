import React, { useState, useEffect, Fragment } from 'react';
import { Col, Row, Progress } from 'reactstrap';
import Widget from '../../../components/Widget';
import API from '../../../actions/portalAPI';
import Loader from "../../../components/Loader";
import DealersTable from './DealersTable';
import s from './ListDealers.module.scss';

const ListDealers = () => {
    const [loading, setLoading] = useState(true);
    const [dealers, setDealers] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        API.get('/api/templatebuilder/dealers/')
            .then(res => {
                setDealers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setError(true);
                setLoading(false);
            })
    }, [])

    return (
        <Fragment>
            <h1 className="page-title">View Dealers</h1>
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
                                {
                                    loading ? <Loader size={75} /> 
                                    : error ? <p>Something went wrong please try again later.</p>
                                    : (dealers.length === 0) ? <p>No dealers found.</p>
                                    : <DealersTable dealers={dealers} />
                                }
                            </Widget>
                        </Col>
                    </Row>
                </div>
            </div>
        </Fragment>
    )
}

export default ListDealers;