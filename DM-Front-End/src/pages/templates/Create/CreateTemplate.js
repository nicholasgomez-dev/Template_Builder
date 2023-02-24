import React, { useState, useEffect } from "react";
import API from '../../../actions/portalAPI';
import { Row, Col, Button, FormGroup, Form, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Loader from '../../../components/Loader/Loader';
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css'
import 'codemirror/mode/htmlmixed/htmlmixed'

const CreateTemplate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [settings, setSettings] = useState([]);
    const [formData, setFormData] = useState({});
    const [oemDropdownOpen, setOemDropdownOpen] = useState(false);
    const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);

    // Get settings on load
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
        setFormData(prevState => {return { ...prevState,platform: e.target.innerText}});
    }

    // Form handlers
    function handleSubmission() {
        console.log("Submitting form...");
    };

    // Form component
    const CreateTemplateForm = () => {
        return (
            <div className="page-form">
                <Form onSubmit={handleSubmission}>
                    <FormGroup>
                        <Label for="name">Template Name</Label>
                        <Input type="text" name="name" id="name" placeholder="Template Name" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Template Description</Label>
                        <Input type="text" name="description" id="description" placeholder="Template Description" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="oem">OEM</Label>
                        <Dropdown isOpen={oemDropdownOpen} toggle={toggleOemDropdown} >
                            <DropdownToggle caret>{formData.oem ? formData.oem : 'Select Option'}</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={(e) => handleOEMInput(e)}>All OEMs</DropdownItem>
                                {settings.oem ? settings.oem.map((oem) => <DropdownItem onClick={(e) => handleOEMInput(e)}>{oem}</DropdownItem>) : ''}
                            </DropdownMenu>
                        </Dropdown>
                    </FormGroup>
                    <FormGroup>
                        <Label for="platform">Platform</Label>
                        <Dropdown isOpen={platformDropdownOpen} toggle={togglePlatformDropdown} >
                            <DropdownToggle caret>{formData.platform ? formData.platform : 'Select Option'}</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={(e) => handlePlatformInput(e)}>All Platforms</DropdownItem>
                                {settings.platform ? settings.platform.map((platform) => <DropdownItem onClick={(e) => handlePlatformInput(e)}>{platform}</DropdownItem>) : ''}
                            </DropdownMenu>
                        </Dropdown>
                    </FormGroup>
                    <FormGroup>
                        <Label for="template">Upload Template Code</Label>
                        <CodeMirror value={null} options={{ mode: 'htmlmixed', theme: 'material', lineNumbers: false }} onBeforeChange={(editor, data, value) => console.log('yay')} />
                    </FormGroup>
                    <p onClick={() => console.log(formData)}>Print</p>
                </Form>
            </div>
        )
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
                : <CreateTemplateForm />
            }
        </div>
    )
};

export default CreateTemplate;