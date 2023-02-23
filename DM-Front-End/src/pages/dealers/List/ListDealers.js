import React, { useState, useEffect, Fragment } from 'react';
import API from '../../../actions/portalAPI';
import Loader from "../../../components/Loader";
import DealersTable from './DealersTable';

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
            {
                loading ? <Loader size={75} /> 
                : error ? <p>Something went wrong please try again later.</p>
                : (dealers.length === 0) ? <p>No dealers found.</p>
                : <DealersTable dealers={dealers} />
            }
        </Fragment>
    )
}

export default ListDealers;