import React, { useEffect, useState } from 'react';
import _ from "lodash";
import API from '../../../actions/portalAPI';
import { FormGroup, Form, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Loader from '../../../components/Loader/Loader';

const UpdateVariable = (props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [variable, setVariable] = useState({});
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setSuccess(false);
        API.get(`/api/templatebuilder/variables/search?_id=${props.match.params.id}`)
            .then(res => {
                setFormData(res.data[0]);
                setVariable(res.data[0]);
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
    function handleValueInput(value) {
        setFormData(prevState => {return { ...prevState, value: value}});
    }
    function handleDescriptionInput(value) {
        setFormData(prevState => {return { ...prevState, description: value}});
    }

    // Validation handler
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
            API.get(`/api/templatebuilder/variables/search?value=${formData.value}`)
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

    // Submission handlers
    function sendFormData() {
        delete formData._id;
        API.post(`/api/templatebuilder/variables/update?_id=${variable._id}`, formData)
            .then(res => {
                if (res.status === 200) {
                    setSuccess('Variable successfully updated.');
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
        if (_.isEqual(formData, variable)) {
            return setMessage('No changes were made.');
        }
        // Check if name was changed
        if (formData.name !== variable.name) {
            try {
                await uniqueVariableName();
            } catch (err) {
                return setMessage(err);
            }
        }
        // Check if value was changed
        if (formData.value !== variable.value) {
            try {
                await uniqueVariableValue();
            } catch (err) {
                return setMessage(err);
            }
        }
        sendFormData();
    }

    return (
        <div>
            <h1>Update Variable</h1>
            {
                loading ?
                    <Loader />
                : error ?
                    <p>There was an error loading the dealer.</p>
                : <div className="page-form">
                    <Form onSubmit={(e) => handleSubmission(e)}>
                        <FormGroup>
                            <Label for="variableName">Variable Name</Label>
                            <Input type="text" name="variableName" id="variableName" placeholder="Variable Name" onChange={(e) => handleNameInput(e.target.value)} required value={formData.name} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="variableValue">Variable Value</Label>
                            <Input type="text" name="variableValue" id="variableValue" placeholder="Variable Value" onChange={(e) => handleValueInput(e.target.value)} required value={formData.value} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="variableDescription">Variable Description</Label>
                            <Input type="text" name="variableDescription" id="variableDescription" placeholder="Variable Description" onChange={(e) => handleDescriptionInput(e.target.value)} required value={formData.description}/>
                        </FormGroup>
                        <input type="submit" value="Submit" />
                    </Form>
                    {message ? <p style={{color:'red'}}>{message}</p> : ''}
                    {success ? <p style={{color:'green'}}>{success}</p> : ''}
                  </div>
            }
        </div>
    )
}

export default UpdateVariable;