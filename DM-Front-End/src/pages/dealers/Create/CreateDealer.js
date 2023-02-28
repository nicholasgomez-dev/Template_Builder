import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import API from '../../../actions/portalAPI';
import { FormGroup, Form, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Loader from '../../../components/Loader/Loader';

const CreateDealer = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [success, setSuccess] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [settings, setSettings] = useState([]);
    const [formData, setFormData] = useState({});
    const [oemDropdownOpen, setOemDropdownOpen] = useState(false);
    const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);

    // Get OEM and Platform lists on load
    useEffect(() => {
        setLoading(true);
        API.get('/api/templatebuilder/settings/')
            .then(res => {
                setSettings(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setError(true);
                setLoading(false);
            })
    }, []);

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
    function allDataExists() {
        return new Promise((resolve, reject) => {
            if (formData.oem && formData.platform && formData.name) {
                resolve(true);
            }
            reject('Please fill out all fields.');
        })
    }
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
        API.post('/api/templatebuilder/dealers/save', formData)
            .then(res => {
                if (res.status === 200) {
                    setSubmitted(false);
                    setSuccess('Dealer successfully created.');
                    return setTimeout(() => {
                        setRedirect(true);
                    }, 2000);
                }
                console.log(res);
                setSubmitted(false);
                setMessage('Something went wrong. Please try again later.');
            })
            .catch(err => {
                console.log(err);
                setSubmitted(false);
                setMessage('Something went wrong. Please try again later.');
            })
    }

    // Submission handler
    async function handleSubmission(e) {
        e.preventDefault();
        setMessage(null);
        setSubmitted(true);
        Promise.all([allDataExists(), uniqueDealerName()])
            .then(() => {
                sendFormData();
            })
            .catch(err => {
                console.log(err);
                setSubmitted(false);
                setMessage(err);
            })
    }
    

    return (
        <div>
            <h1>Create Dealer</h1>
            {
                loading ? 
                    <Loader /> 
                : error ?
                    <p>Something went wrong please try again later...</p>
                : <div className="page-form">
                    <Form onSubmit={(e) => handleSubmission(e)}>
                        <FormGroup>
                            <Label for="dealerName">Dealer Name</Label>
                            <Input type="text" name="dealerName" id="dealerName" placeholder="Dealer Name" onChange={(e) => handleNameInput(e.target.value)} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="oem">OEM<span style={{color:'red'}}>*</span></Label>
                            <Dropdown name="oem" required isOpen={oemDropdownOpen} toggle={toggleOemDropdown} >
                                <DropdownToggle caret>{formData.oem ? formData.oem : 'Select Option'}</DropdownToggle>
                                <DropdownMenu>
                                    {settings.oem ? settings.oem.map((oem, index) => <DropdownItem key={index} onClick={(e) => handleOEMInput(e)}>{oem}</DropdownItem>) : ''}
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>
                        <FormGroup>
                            <Label for="platform">Platform<span style={{color:'red'}}>*</span></Label>
                            <Dropdown name="platform" required isOpen={platformDropdownOpen} toggle={togglePlatformDropdown} >
                                <DropdownToggle caret>{formData.platform ? formData.platform : 'Select Option'}</DropdownToggle>
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

export default CreateDealer;