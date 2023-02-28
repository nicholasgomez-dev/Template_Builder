import React, { useEffect, useState } from 'react';
import _ from "lodash";
import API from '../../../actions/portalAPI';
import { FormGroup, Form, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Loader from '../../../components/Loader/Loader';
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css'
import 'codemirror/mode/htmlmixed/htmlmixed'

const UpdateTemplate = (props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [template, setTemplate] = useState({});
    const [formData, setFormData] = useState({});
    const [settings, setSettings] = useState({});
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [oemDropdownOpen, setOemDropdownOpen] = useState(false);
    const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);

    useEffect(() => {
        setSuccess(false);
        Promise.all([API.get('/api/templatebuilder/settings/'), API.get(`/api/templatebuilder/templates/search?_id=${props.match.params.id}`)])
            .then(res => {
                setSettings(res[0].data);
                setFormData(res[1].data[0]);
                setTemplate(res[1].data[0]);
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
    function handleCodeMirrorInput(value) {
        setFormData(prevState => {return { ...prevState, html: value}});
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
            let variables = html.match(/{{\w+}}/g);
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

    // Submission handler
    function sendFormData() {
        delete formData._id;
        API.post(`/api/templatebuilder/templates/update?_id=${template._id}`, formData)
            .then(res => {
                if (res.status === 200) {
                    setSuccess('Template successfully updated.');
                    return setTimeout(() => {
                        setLoading(true);
                    }, 3000);
                }
                console.log(res);
                setMessage('Something went wrong. Please try again later.');
            })
            .catch(err => {
                console.log(err);
                setMessage('Something went wrong. Please try again later.');
            });
    } 
    async function handleSubmission(e) {
        e.preventDefault();
        setMessage('');
        //Check if any changes were made
        if (_.isEqual(formData, template)) {
            return setMessage('No changes were made.');
        }
        // Check if name was changed
        if (formData.name !== template.name) {
            try {
                await uniqueTemplateName();
            } catch (err) {
                return setMessage(err);
            }
        }
        // Check if html was changed
        if (formData.html !== template.html) {
            try {
                await validateVariables();
            } catch (err) {
                return setMessage(err);
            }
        }
        // Check if all fields are filled out
        try {
            await allDataExists();
        } catch (err) {
            return setMessage(err);
        }
        // Submit changes
        sendFormData()
    }

    return (
        <div>
            <h1>Update Template</h1>
            {
                loading ?
                    <Loader />
                : error ?
                    <p>There was an error loading the template.</p>
                : <div className="page-form">
                    <Form onSubmit={(e) => handleSubmission(e)}>
                        <FormGroup>
                            <Label for="name">Template Name<span style={{color:'red'}}>*</span></Label>
                            <Input type="text" name="name" id="name" placeholder="Template Name" onChange={(e) => handleNameInput(e.target.value)} required value={formData.name} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Template Description<span style={{color:'red'}}>*</span></Label>
                            <Input type="text" name="description" id="description" placeholder="Template Description" onChange={(e) => handleDescriptionInput(e.target.value)} required value={formData.description} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="oem">OEM<span style={{color:'red'}}>*</span></Label>
                            <Dropdown name="oem" required isOpen={oemDropdownOpen} toggle={toggleOemDropdown} >
                                <DropdownToggle caret>{formData.oem}</DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={(e) => handleOEMInput(e)}>All OEMs</DropdownItem>
                                    {settings.oem ? settings.oem.map((oem, index) => <DropdownItem key={index} onClick={(e) => handleOEMInput(e)}>{oem}</DropdownItem>) : ''}
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>
                        <FormGroup>
                            <Label for="platform">Platform<span style={{color:'red'}}>*</span></Label>
                            <Dropdown name="platform" required isOpen={platformDropdownOpen} toggle={togglePlatformDropdown} >
                                <DropdownToggle caret>{formData.platform}</DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={(e) => handlePlatformInput(e)}>All Platforms</DropdownItem>
                                    {settings.platform ? settings.platform.map((platform, index) => <DropdownItem key={index} onClick={(e) => handlePlatformInput(e)}>{platform}</DropdownItem>) : ''}
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>
                        <FormGroup>
                            <Label for="html">Upload Minified HTML<span style={{color:'red'}}>*</span></Label>
                            <CodeMirror name="html" required value={formData.html} options={{ mode: 'htmlmixed', theme: 'material', lineNumbers: false }} onBeforeChange={(editor, data, value) => handleCodeMirrorInput(value)} />
                        </FormGroup>
                        <input type="submit" value="Submit" />
                    </Form>
                    {message ? <p style={{color:'red'}}>{message}</p> : ''}
                    {success ? <p style={{color:'green'}}>{success}</p> : ''}
                  </div>
            }
        </div>
    );
}

export default UpdateTemplate;