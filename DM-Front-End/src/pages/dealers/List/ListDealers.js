import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Loader from "../../../components/Loader";
import TableContainer from '../../analytics/components/TableContainer/TableContainer';

const ListDealers = () => {
    const [loading, setLoading] = useState(true);
    const [dealers, setDealers] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get('/api/templates')
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
            {
                loading ? <Loader size={75} /> 
                : error ? <p>Something went wrong please try again later.</p>
                : <TableContainer data={dealers} />
            }
        </Fragment>
    )
}

export default ListDealers;