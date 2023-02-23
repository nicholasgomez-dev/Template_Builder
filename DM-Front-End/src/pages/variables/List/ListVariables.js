import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Loader from "../../../components/Loader";
import TableContainer from '../../analytics/components/TableContainer/TableContainer';

const ListVariables = () => {
    const [loading, setLoading] = useState(true);
    const [variables, setVariables] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get('/api/templates')
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
                : <TableContainer data={variables} />
            }
        </Fragment>
    )
}

export default ListVariables;