import React, { useState, useEffect, Fragment } from 'react';
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
            {
                loading ? <Loader size={75} /> 
                : error ? <p>Something went wrong please try again later.</p>
                : (variables.length === 0) ? <p>No variables found.</p>
                : <VariablesTable variables={variables} /> 
            }
        </Fragment>
    )
}

export default ListVariables;