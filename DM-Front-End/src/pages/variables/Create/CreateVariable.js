import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import API from '../../../actions/portalAPI';
import { FormGroup, Form, Label, Input } from 'reactstrap';

const CreateVariables = () => {
    const [message, setMessage] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({});
    const [redirect, setRedirect] = useState(false);

    // Input handlers
    function handleNameInput(value) {
        setFormData(prevState => {return { ...prevState, name: value}});
    }
    function handleValueInput(value) {
        setFormData(prevState => {return { ...prevState, value: value}});
    }
    function handleDescriptionInput(value) {
        setFormData(prevState => {return { ...prevState, description: value}});
    }

    // Validation handler
    function allDataExists() {
        return new Promise((resolve, reject) => {
            if (formData.name && formData.value && formData.description) {
                resolve(true);
            }
            reject('Please fill out all fields.');
        })
    }
    function uniqueVariableName() {
        return new Promise((resolve, reject) => {
            API.get(`/api/templatebuilder/variables/search?name=${formData.name}`)
            .then(res => {
                if (res.data.length > 0) {
                    reject('Variable name already exists. Please choose a different name.');
                }
                resolve(true);
            })
            .catch(err => {
                console.log(err);
                reject('Something went wrong. Please try again later.');
            })
        })
    }
    function uniqueVariableValue() {
        return new Promise((resolve, reject) => {
            API.get(`/api/templatebuilder/variables/search?name=${formData.value}`)
            .then(res => {
                if (res.data.length > 0) {
                    reject('Variable value already exists. Please choose a different name.');
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
        API.post('/api/templatebuilder/variables/save', formData)
            .then(res => {
                if (res.status === 200) {
                    setSuccess('Variable successfully created.');
                    return setTimeout(() => {
                        setRedirect(true);
                    }, 3000);
                }
                console.log(res);
                setMessage('Something went wrong. Please try again later.');
            })
            .catch(err => {
                console.log(err);
                setMessage('Something went wrong. Please try again later.');
            })
    }

    // Submission handler
    async function handleSubmission(e) {
        e.preventDefault();
        Promise.all([allDataExists(), uniqueVariableName(), uniqueVariableValue()])
            .then(() => {
                sendFormData();
            })
            .catch(err => {
                console.log(err);
                setMessage(err);
            })

        console.log(formData);
    }

    return (
        <div>
            <h1>Create Variable</h1>
            <div className="page-form">
                <Form onSubmit={(e) => handleSubmission(e)}>
                    <FormGroup>
                        <Label for="variableName">Variable Name</Label>
                        <Input type="text" name="variableName" id="variableName" placeholder="Variable Name" onChange={(e) => handleNameInput(e.target.value)} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="variableValue">Variable Value</Label>
                        <Input type="text" name="variableValue" id="variableValue" placeholder="Variable Value" onChange={(e) => handleValueInput(e.target.value)} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="variableDescription">Variable Description</Label>
                        <Input type="text" name="variableDescription" id="variableDescription" placeholder="Variable Description" onChange={(e) => handleDescriptionInput(e.target.value)} required />
                    </FormGroup>
                    <input type="submit" value="Submit" />
                </Form>
                {message ? <p style={{color:'red'}}>{message}</p> : ''}
                {success ? <p style={{color:'green'}}>{success}</p> : ''}
                {redirect ? <Redirect to="/app/main/variables" /> : ''}
            </div>
        </div>
    );
}

export default CreateVariables;