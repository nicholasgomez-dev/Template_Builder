import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import _ from "lodash";
import API from '../../../actions/portalAPI';
import { FormGroup, Form, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Loader from '../../../components/Loader/Loader';

const UpdateDealer = (props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [dealer, setDealer] = useState({});
    const [formData, setFormData] = useState({});
    const [settings, setSettings] = useState({});
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [oemDropdownOpen, setOemDropdownOpen] = useState(false);
    const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);

    useEffect(() => {
        setSuccess(false);
        Promise.all([API.get('/api/templatebuilder/settings/'), API.get(`/api/templatebuilder/dealers/search?_id=${props.match.params.id}`)])
            .then(res => {
                setSettings(res[0].data);
                setFormData(res[1].data[0]);
                setDealer(res[1].data[0]);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setError(true);
                setLoading(false);
            })
    }, [loading]);

    // Input handlers
    function handleNameInput(value) {
        setFormData(prevState => {return { ...prevState, name: value}});
    }
    function toggleOemDropdown() {
        setOemDropdownOpen(prevState => !prevState);
    };
    function togglePlatformDropdown() {
        setPlatformDropdownOpen(prevState => !prevState);
    };
    function handleOEMInput(e) {
        setFormData(prevState => {return {...prevState, oem: e.target.innerText}});
    };
    function handlePlatformInput(e) {
        setFormData(prevState => {return { ...prevState, platform: e.target.innerText}});
    }

    // Validation handler
    function uniqueDealerName() {
        return new Promise((resolve, reject) => {
            API.get(`/api/templatebuilder/dealers/search?name=${formData.name}`)
            .then(res => {
                if (res.data.length > 0) {
                    reject('Template name already exists. Please choose a different name.');
                }
                resolve(true);
            })
            .catch(err => {
                console.log(err);
                reject('Something went wrong. Please try again later.');
            })
        })
    }
    function sendFormData() {
        delete formData._id;
        API.post(`/api/templatebuilder/dealers/update?_id=${dealer._id}`, formData)
            .then(res => {
                if (res.status === 200) {
                    setSubmitted(false);
                    setSuccess('Dealer successfully updated.');
                    return setTimeout(() => {
                        setRedirect(true);
                    }, 3000);
                }
                console.log(res);
                setSubmitted(false);
                setMessage('Something went wrong. Please try again later.');
            })
            .catch(err => {
                console.log(err);
                setSubmitted(false);
                setMessage('Something went wrong. Please try again later.');
            });
    }

    // Submission handler
    async function handleSubmission(e) {
        e.preventDefault();
        setMessage(null);
        setSubmitted(true);
        //Check if any changes were made
        if (_.isEqual(formData, dealer)) {
            setSubmitted(false);
            return setMessage('No changes were made.');
        }
        // Check if name was changed
        if (formData.name !== dealer.name) {
            try {
                await uniqueDealerName();
            } catch (err) {
                setSubmitted(false);
                return setMessage(err);
            }
        }
        sendFormData();
    }


    return (
        <div>
            <h1>Update Dealer</h1>
            {
                loading ?
                    <Loader />
                : error ?
                    <p>There was an error loading the dealer.</p>
                : <div className="page-form">
                    <Form onSubmit={(e) => handleSubmission(e)}>
                        <FormGroup>
                            <Label for="dealerName">Dealer Name</Label>
                            <Input type="text" name="dealerName" id="dealerName" placeholder="Dealer Name" onChange={(e) => handleNameInput(e.target.value)} value={formData.name} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="oem">OEM<span style={{color:'red'}}>*</span></Label>
                            <Dropdown name="oem" required isOpen={oemDropdownOpen} toggle={toggleOemDropdown} >
                                <DropdownToggle caret>{formData.oem}</DropdownToggle>
                                <DropdownMenu>
                                    {settings.oem ? settings.oem.map((oem, index) => <DropdownItem key={index} onClick={(e) => handleOEMInput(e)}>{oem}</DropdownItem>) : ''}
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>
                        <FormGroup>
                            <Label for="platform">Platform<span style={{color:'red'}}>*</span></Label>
                            <Dropdown name="platform" required isOpen={platformDropdownOpen} toggle={togglePlatformDropdown} >
                                <DropdownToggle caret>{formData.platform}</DropdownToggle>
                                <DropdownMenu>
                                    {settings.platform ? settings.platform.map((platform, index) => <DropdownItem key={index} onClick={(e) => handlePlatformInput(e)}>{platform}</DropdownItem>) : ''}
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>
                        {
                            submitted ? 
                                <Loader /> 
                            : success ?
                                <p style={{color:'green'}}>{success}</p>
                            : 
                                <input type="submit" value="Submit" />
                        }
                    </Form>
                    {message ? <p style={{color:'red'}}>{message}</p> : ''}
                    {redirect ? <Redirect to="/app/main/dealers" /> : ''}
                  </div>
            }
        </div>
    )
};

export default UpdateDealer;