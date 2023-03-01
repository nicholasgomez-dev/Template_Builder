import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import API from '../../../actions/portalAPI';
import { FormGroup, Form, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Loader from '../../../components/Loader/Loader';
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css'
import 'codemirror/mode/htmlmixed/htmlmixed'

const CreateTemplate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [success, setSuccess] = useState(null);
    const [settings, setSettings] = useState([]);
    const [formData, setFormData] = useState({});
    const [oemDropdownOpen, setOemDropdownOpen] = useState(false);
    const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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
    function handleCodeMirrorInput(value) {
        setFormData(prevState => {return { ...prevState, html: value}});
    }
    function handleNameInput(value) {
        setFormData(prevState => {return { ...prevState, name: value}});
    }
    function handleDescriptionInput(value) {
        setFormData(prevState => {return { ...prevState, description:value}});
    }

    // Validation handlers
    function allDataExists() {
        return new Promise((resolve, reject) => {
            if (formData.oem && formData.platform && formData.name && formData.description && formData.html) {
                resolve(true);
            }
            reject('Please fill out all fields.');
        })
    }
    function uniqueTemplateName() {
        return new Promise((resolve, reject) => {
            API.get(`/api/templatebuilder/templates/search?name=${formData.name}`)
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
    function validateVariables() {
        return new Promise((resolve, reject) => {
            let html = formData.html;
            let variables = html.match(/{{.*?}}/g);
            console.log(variables)
            let uniqueVariables = [...new Set(variables)];
            // If no variables are found, return false
            if (uniqueVariables.length === 0) {
                reject('No variables found. Please add variables to the template.');
            }
            // Get variables from DB
            API.get('/api/templatebuilder/variables/')
                .then(res => {
                    let dbVariables = res.data.map(variable => variable.value);
                    // Check if all variables are in DB
                    let allVariablesExist = uniqueVariables.every(variable => dbVariables.includes(variable));
                    if (allVariablesExist) {
                        resolve(true);
                    }
                    reject('One or more variables do not exist in the database. Please add them before submitting.');
                })
                .catch(err => {
                    console.log(err);
                    reject('Something went wrong. Please try again later.');
                })
        })
    }
    function sendFormData() {
        API.post('/api/templatebuilder/templates/save', formData)
            .then(res => {
                if (res.status === 200) {
                    setSubmitted(false);
                    setSuccess('Template successfully created.');
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

    // Form submission handler
    async function handleSubmission(e) {
        e.preventDefault()
        setMessage(null);
        setSubmitted(true);
        Promise.all([allDataExists(), uniqueTemplateName(), validateVariables()])
            .then(() => {
                sendFormData()
            })
            .catch(err => {
                console.log(err)
                setSubmitted(false);
                setMessage(err);
            })
    };

    // Render
    return (
        <div>
            <h1 className="page-title">Create Template</h1>
            {
                loading ?
                    <Loader />
                : error ?
                    <p>Something went wrong please try again later...</p>
                :   <div className="page-form">
                        <p>Required Fields = <span style={{color:'red'}}>*</span></p>
                        <Form onSubmit={(e) => handleSubmission(e)}>
                            <FormGroup>
                                <Label for="name">Template Name<span style={{color:'red'}}>*</span></Label>
                                <Input type="text" name="name" id="name" placeholder="Template Name" onChange={(e) => handleNameInput(e.target.value)} required />
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Template Description<span style={{color:'red'}}>*</span></Label>
                                <Input type="text" name="description" id="description" placeholder="Template Description" onChange={(e) => handleDescriptionInput(e.target.value)} required />
                            </FormGroup>
                            <FormGroup>
                                <Label for="oem">OEM<span style={{color:'red'}}>*</span></Label>
                                <Dropdown name="oem" required isOpen={oemDropdownOpen} toggle={toggleOemDropdown} >
                                    <DropdownToggle caret>{formData.oem ? formData.oem : 'Select Option'}</DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={(e) => handleOEMInput(e)}>All OEMs</DropdownItem>
                                        {settings.oem ? settings.oem.map((oem, index) => <DropdownItem key={index} onClick={(e) => handleOEMInput(e)}>{oem}</DropdownItem>) : ''}
                                    </DropdownMenu>
                                </Dropdown>
                            </FormGroup>
                            <FormGroup>
                                <Label for="platform">Platform<span style={{color:'red'}}>*</span></Label>
                                <Dropdown name="platform" required isOpen={platformDropdownOpen} toggle={togglePlatformDropdown} >
                                    <DropdownToggle caret>{formData.platform ? formData.platform : 'Select Option'}</DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={(e) => handlePlatformInput(e)}>All Platforms</DropdownItem>
                                        {settings.platform ? settings.platform.map((platform, index) => <DropdownItem key={index} onClick={(e) => handlePlatformInput(e)}>{platform}</DropdownItem>) : ''}
                                    </DropdownMenu>
                                </Dropdown>
                            </FormGroup>
                            <FormGroup>
                                <Label for="html">Upload Minified HTML<span style={{color:'red'}}>*</span></Label>
                                <CodeMirror name="html" required value={formData.html ? formData.html : ''} options={{ mode: 'htmlmixed', theme: 'material', lineNumbers: false }} onBeforeChange={(editor, data, value) => handleCodeMirrorInput(value)} />
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
                    {redirect ? <Redirect to="/app/main/templates" /> : ''}
                    </div>
            }
        </div>
    )
};

export default CreateTemplate;