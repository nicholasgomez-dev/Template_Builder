import React, { useEffect, useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import _ from "lodash";
import API from '../../../actions/portalAPI';
import { FormGroup, Form, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Loader from '../../../components/Loader/Loader';
import { Controlled as CodeMirror } from 'react-codemirror2'
import styles from './UpdateTemplate.module.scss'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css'
import 'codemirror/mode/htmlmixed/htmlmixed'

const UpdateTemplate = (props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [template, setTemplate] = useState({});
    const [formData, setFormData] = useState({});
    const [settings, setSettings] = useState({});
    const [variables, setVariables] = useState([]);
    const [databaseVariables, setDatabaseVariables] = useState([]);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [oemDropdownOpen, setOemDropdownOpen] = useState(false);
    const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [redirect, setRedirect] = useState(false);

    // Use ref to access Variables list instance
    const variablesList = useRef(null);

    useEffect(() => {
        setSuccess(false);
        Promise.all([
            API.get('/api/templatebuilder/settings/'), 
            API.get(`/api/templatebuilder/templates/search?_id=${props.match.params.id}`),
            API.get('/api/templatebuilder/variables/')])
            .then(res => {
                let DB_Variables = res[2].data.map(variable => {
                    return variable.value;
                })
                setSettings(res[0].data);
                setFormData(res[1].data[0]);
                setVariables([...new Set(res[1].data[0].html.match(/{{.*?}}/g))]);
                setTemplate(res[1].data[0]);
                setDatabaseVariables(DB_Variables);
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
        setVariables([...new Set(value.match(/{{.*?}}/g))]);
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
            let variables = html.match(/{{.*?}}/g);
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
                    setSubmitted(false);
                    setSuccess('Template successfully updated.');
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
    async function handleSubmission(e) {
        e.preventDefault();
        setMessage(null);
        setSubmitted(true);
        //Check if any changes were made
        if (_.isEqual(formData, template)) {
            setSubmitted(false);
            return setMessage('No changes were made.');
        }
        // Check if name was changed
        if (formData.name !== template.name) {
            try {
                await uniqueTemplateName();
            } catch (err) {
                setSubmitted(false);
                return setMessage(err);
            }
        }
        // Check if html was changed
        if (formData.html !== template.html) {
            try {
                await validateVariables();
            } catch (err) {
                setSubmitted(false);
                return setMessage(err);
            }
        }
        // Check if all fields are filled out
        try {
            await allDataExists();
        } catch (err) {
            setSubmitted(false);
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
                        <div className={styles["split-inputs-container"]}>
                            <div>
                                <FormGroup>
                                    <Label for="name">Template Name<span style={{color:'red'}}>*</span></Label>
                                    <Input type="text" name="name" id="name" placeholder="Template Name" onChange={(e) => handleNameInput(e.target.value)} required value={formData.name} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="description">Template Description<span style={{color:'red'}}>*</span></Label>
                                    <Input type="text" name="description" id="description" placeholder="Template Description" onChange={(e) => handleDescriptionInput(e.target.value)} required value={formData.description} />
                                </FormGroup>
                            </div>

                            <div>
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
                            </div>
                        </div>

                        <div className={styles["split-container"]}>
                                <div className="split-container-left">
                                    <FormGroup>
                                        <Label for="html">Upload Minified HTML<span style={{color:'red'}}>*</span></Label>
                                        <CodeMirror name="html" required value={formData.html} options={{ mode: 'htmlmixed', theme: 'material', lineNumbers: false }} onBeforeChange={(editor, data, value) => handleCodeMirrorInput(value)} />
                                    </FormGroup>
                                </div>
                                <div className="split-container-right">
                                    <div className="variables-container">
                                    <Label>Variables Found/Missing</Label>
                                        <ul ref={variablesList} id="variables-list">
                                            {(variables.length > 0) ? variables.map((variable, index) => {
                                                // if variable is found in databaseVariables
                                                if (databaseVariables.includes(variable)) {
                                                    return <li key={index} className={styles.found}>{variable} - Found in Database</li>
                                                }
                                                return <li key={index} className={styles.missing}>{variable} - Missing From Database</li>
                                            }) : ''}
                                        </ul>
                                    </div>
                                </div>
                            </div>
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
    );
}

export default UpdateTemplate;