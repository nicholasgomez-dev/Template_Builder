import React, { useState, useEffect, Fragment } from 'react';
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
                console.log(res.data)
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
            {
                loading ? <Loader size={75} /> 
                : error ? <p>Something went wrong please try again later.</p>
                : <p>Data found.</p>
            }
        </Fragment>
    )
}

export default ListTemplates;