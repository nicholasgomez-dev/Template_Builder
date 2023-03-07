import React, { useEffect, useState, Fragment } from "react";
import API from '../../../actions/portalAPI';
import { FormGroup, Form, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Collapse, Card, CardBody, CardTitle, CardHeader, CardText, CardImg, CardGroup, CardColumns } from 'reactstrap';
import Loader from '../../../components/Loader/Loader';
import { Controlled as CodeMirror } from 'react-codemirror2'
import styles from './BuildTemplate.module.scss';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css'
import 'codemirror/mode/htmlmixed/htmlmixed'

const BuildTemplate = (props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [dealer, setDealer] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [builder, setBuilder] = useState(false);

    useEffect(() => {
        API.get(`/api/templatebuilder/dealers/search?_id=${props.match.params.id}`)
            .then(res => {
                setDealer(res.data[0]);
                API.get(`/api/templatebuilder/templates/filter?oem=${res.data[0].oem}&platform=${res.data[0].platform}`)
                    .then(res => {
                        setTemplates(res.data);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.log(err);
                        setError(true);
                        setLoading(false);
                    })
            })
            .catch(err => {
                console.log(err);
                setError(true);
                setLoading(false);
            })
    }, []);

    // Input handlers
    function handleBuilder() {
        setBuilder(true);
    }
    function handleTemplateSelect(template) {
        // If template is already selected, remove it from the selected templates array
        if (template.selected) {
            setSelectedTemplates(selectedTemplates.filter(t => t._id !== template._id));
        } else {
            setSelectedTemplates([...selectedTemplates, template]);
        }
        // Toggle selected property on template
        template.selected = !template.selected;
    }

    // Render JSX Sections
    const TemplateSelection = (props) => {
        const { filteredTemplates } = props;

        return (
            <div className="template-selection-container">
                <h2>Select Templates</h2>
                <div className="template-section">
                    <CardColumns>
                        {filteredTemplates.map((template, index) => {
                            return (
                                <Card key={index} onClick={() => handleTemplateSelect(template)}>
                                    <CardTitle>
                                        <h4>{template.name}</h4>
                                    </CardTitle>
                                    <CardBody>
                                        <CardText>
                                            {template.description}
                                        </CardText>
                                        <CardText>
                                            {template.oem}
                                        </CardText>
                                        <CardText>
                                            {template.platform}
                                        </CardText>
                                        <CardText>
                                            {template.selected ? 'Selected' : ''}
                                        </CardText>
                                    </CardBody>
                                </Card>
                            )
                        })}
                    </CardColumns>
                </div>
                <input type="button" value="Build" onClick={() => handleBuilder()} />
            </div>
        )
    }
    const Builder = (props) => {
        const [loadingBuilder, setLoadingBuilder] = useState(true);
        const [errorBuilder, setErrorBuilder] = useState(false);
        const [messageBuilder, setMessageBuilder] = useState('');
        const [databaseVariables, setDatabaseVariables] = useState([]);
        const [formData, setFormData] = useState({});

        let { buildTemplates } = props;

        useEffect(() => {
            // Get unique variables from templates & set changedHTML field to each template
            let variables = [];
            for (let i = 0; i < buildTemplates.length; i++) {
                variables.push(buildTemplates[i].html.match(/{{.*?}}/g))
                buildTemplates[i].changedHTML = buildTemplates[i].html;
            }
            let uniqueVars = [...new Set(variables.flat())];
            
            // Set initial form data with each unique variable
            let initFormData = {};
            for (let i = 0; i < uniqueVars.length; i++) {
                initFormData[uniqueVars[i]] = '';
            }

            // Get all variables from database
            let queryString = '';
            for (let i = 0; i < uniqueVars.length; i++) {
                queryString += `&value=${uniqueVars[i]}`;
            }
            API.get(`/api/templatebuilder/variables/filter?${queryString}`)
            .then(res => {
                setDatabaseVariables(res.data);
                setFormData(initFormData);
                setLoadingBuilder(false);
            })
            .catch(err => {
                console.log(err);
                setErrorBuilder(true);
                setLoadingBuilder(false);
            })
        }, []);

        // Input handlers
        function handleInputChange(e) {
            let newFormData = {...formData};
            newFormData[e.target.name] = e.target.value;
            for (let i = 0; i < buildTemplates.length; i++) {
                let newStr = buildTemplates[i].html
                for (let key in newFormData) {
                    if (newFormData[key] !== '') {
                        newStr = newStr.replaceAll(key, newFormData[key]);
                    }
                }
                buildTemplates[i].changedHTML = newStr;
            }
            setFormData(newFormData);
        }
        function handleSaveVariables() {
            // If every field in formdata is filled out
            for (let key in formData) {
                if (formData[key] === '') {
                    setMessageBuilder('Please fill out all fields.');
                    return;
                }
            }
            // Push formdata to dealer.variables array
            let newDealer = {...dealer};
            newDealer.variables.push(formData);
            // Update dealer in database
            
        }
        
        return (
            <div>
                <h1>Builder</h1>
                {   
                    // If loading
                    loadingBuilder ?
                    <Loader />

                    // If error
                    : errorBuilder ?
                    <p>Something went wrong.</p>
                    
                    // Ready to build
                    :
                    <div className={styles["builder-split-container"]}>
                        <div className="builder-left">
                            {databaseVariables.map((variable, index) => {
                                return (
                                    <FormGroup key={index}>
                                        <Label for={variable.value}>{variable.value} - {variable.description}</Label>
                                        <Input type="text" name={variable.value} id={variable.name} placeholder={variable.value} onChange={(e) => handleInputChange(e)}/>
                                    </FormGroup>
                                )
                            })}
                        </div>
                        <div className="builder-right">
                            {buildTemplates.map((template, index) => {
                                return (
                                    <Card key={index}>
                                        <CardHeader>
                                            {template.name} - <span onClick={() => navigator.clipboard.writeText(template.changedHTML)}>Copy to Clipboard</span>
                                        </CardHeader>
                                        <CardBody>
                                            <CodeMirror name="html" required value={template.changedHTML} options={{ mode: 'htmlmixed', theme: 'material', lineNumbers: false }} />
                                        </CardBody>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                }
                <input type="button" value="Save Variables" onClick={() => console.log('Saving variables...')} />
                {messageBuilder && <p>{messageBuilder}</p>}
            </div>
        )
    }

    return (
        <div>
            {   
                // If loading
                loading ? 
                <Loader />

                // If error
                : error ?
                <p>Something went wrong.</p> 

                // If builder
                : builder ?
                <Builder buildTemplates={selectedTemplates} />

                // If templates
                : (dealer && templates) ?
                <TemplateSelection filteredTemplates={templates} />

                // If no data
                : ''

            }
        </div>
    )
}

export default BuildTemplate;