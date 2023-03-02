import React, { useState, useEffect, Fragment } from 'react';
import { Col, Row, Progress } from 'reactstrap';
import Widget from '../../../components/Widget';
import s from './ListVariables.module.scss';
import API from '../../../actions/portalAPI';
import Loader from "../../../components/Loader";
import VariablesTable from './VariablesTable';

const ListVariables = () => {
    const [loading, setLoading] = useState(true);
    const [variables, setVariables] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        API.get('/api/templatebuilder/variables/')
            .then(res => {
                setVariables(res.data);
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
            <h1 className="page-title">View Variables</h1>
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
                                    : (variables.length === 0) ? <p>No variables found.</p>
                                    : <VariablesTable variables={variables} /> 
                                }
                            </Widget>
                        </Col>
                    </Row>
                </div>
            </div>

        </Fragment>
    )
}

export default ListVariables;