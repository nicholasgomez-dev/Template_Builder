import React, { useState, useEffect, Fragment } from 'react';
import { Col, Row, Progress } from 'reactstrap';
import Widget from '../../../components/Widget';
import s from './ListTemplates.module.scss';
import API from '../../../actions/portalAPI';
import Loader from "../../../components/Loader";
import TemplatesTable from './TemplatesTable';

const ListTemplates = () => {
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        API.get('/api/templatebuilder/templates/')
            .then(res => {
                setTemplates(res.data);
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
            <h1 className="page-title">View Templates</h1>
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
                            : (templates.length === 0) ? <p>No templates found.</p>
                            : <TemplatesTable templates={templates} />
                        }
                            </Widget>
                        </Col>
                    </Row>
                </div>
            </div>
        </Fragment>
    )
}

export default ListTemplates;