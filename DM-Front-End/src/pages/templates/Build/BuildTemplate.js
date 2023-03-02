import React, { useEffect, useState, Fragment } from "react";
import API from '../../../actions/portalAPI';
import { FormGroup, Form, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Collapse, Card, CardBody, CardTitle, CardHeader, CardText, CardImg, CardGroup, CardColumns } from 'reactstrap';
import Loader from '../../../components/Loader/Loader';
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css'
import 'codemirror/mode/htmlmixed/htmlmixed'

const BuildTemplate = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [builder, setBuilder] = useState(false);
    const [dealers, setDealers] = useState([]);
    const [selectedDealer, setSelectedDealer] = useState(null);
    const [dealerDropdownOpen, setDealerDropdownOpen] = useState(false);
    const [fetchingTemplates, setFetchingTemplates] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplates, setSelectedTemplates] = useState([]);

    let selectedTemplatesArr = [];

    // Get dealer list on load
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

    // Input handlers
    function toggleDealerDropdown() {
        setDealerDropdownOpen(prevState => !prevState);
    }
    async function handleDealerSelect(dealer) {
        setSelectedDealer(dealer);
        // Fetch templates for dealer
        setFetchingTemplates(true);
        try {
            const res = await API.get(`/api/templatebuilder/templates/filter?oem=${dealer.oem}&platform=${dealer.platform}`);
            setTemplates(res.data);
            setFetchingTemplates(false);
        } catch (err) {
            console.log(err);
            setFetchingTemplates(false);
            setMessage('Something went wrong.');
        }
    }
    function handleBuildClick () {
        setSelectedTemplates(selectedTemplatesArr);
        setBuilder(true);
    }

    // Render Components
    const TemplateCard = (props) => {
        let { template } = props;
        template.selected = false;

        function toggleSelected() {
            if (template.selected) {
                selectedTemplatesArr.splice(selectedTemplatesArr.indexOf(template), 1);
            } else {
                selectedTemplatesArr.push(template);
            }
            template.selected = !template.selected;
        }

        return (
            <Card onClick={() => toggleSelected()}>
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
    }
    const BuildTemplateCard = (props) => {
        let { template } = props;
        const [variables, setVariables] = useState([]);
        const [html, setHtml] = useState(template.html);
        const [formData, setFormData] = useState({});
        const [isOpen, setIsOpen] = useState(false);

        useEffect(() => {
            let vars = [...new Set(template.html.match(/{{.*?}}/g))];
            let newFormData = {};
            for(let i = 0; i < vars.length; i++) {
                newFormData[vars[i]] = '';
                if (selectedDealer?.variables[vars[i]]) {
                    newFormData[vars[i]] = selectedDealer.variables[vars[i]];
                }
            }
            let newHTML = template.html;
            for (let key in newFormData) {
                if (newFormData[key] !== '') {
                    newHTML = newHTML.replaceAll(key, newFormData[key]);
                }
            }
            setFormData(newFormData);
            setHtml(newHTML);
            setVariables(vars);
        }, [])

        // Input handlers
        function handleInputChange(e) {
            formData[e.target.name] = e.target.value;
            let newString = template.html;
            for (let key in formData) {
                if (formData[key] !== '') {
                    newString = newString.replaceAll(key, formData[key]);
                }
            }
            setHtml(newString);
        }
        function handleCopyToClipboard() {
            navigator.clipboard.writeText(html);
        }

        return (
            <div className="BuildCard-Container">
                <Card>
                    <CardHeader onClick={() => setIsOpen(!isOpen)}>
                        {template.name}
                    </CardHeader>
                    <Collapse isOpen={isOpen}>
                        <CardBody>
                            {variables.map((variable, index) => <FormGroup><Label for={variable}>{variable}<span style={{color:'red'}}>*</span></Label><Input key={index} type="text" name={variable} value={formData[variable]} onChange={(e) => handleInputChange(e)} /></FormGroup>)}
                            <CodeMirror name="html" required value={html} options={{ mode: 'htmlmixed', theme: 'material', lineNumbers: false }} />
                            <button onClick={() => handleCopyToClipboard()}>Copy to Clipboard</button>
                        </CardBody>
                    </Collapse>
                </Card>
                
                
            </div>
        )
    }

    // Render Sections
    const SelectTemplates = () => {
        return (
            <div>
                {fetchingTemplates ? 
                    <Loader />
                : (templates.length > 0) ?
                    <Fragment>
                        <CardColumns>
                            {templates.map((template, index) => <TemplateCard key={index} template={template} selected={false}/>)}
                        </CardColumns>
                        <p onClick={() => handleBuildClick()}>BUILD</p>
                    </Fragment>
                :
                    <p>No templates found.</p>
                }
            </div>
        )
    }
    const SelectDealer = () => {
        return (
            <div>
                { (dealers.length > 0) ?
                <Form>
                    <FormGroup>
                        <Label for="platform">Select Dealer<span style={{color:'red'}}>*</span></Label>
                        <Dropdown name="platform" required isOpen={dealerDropdownOpen} toggle={toggleDealerDropdown} >
                            <DropdownToggle caret>{selectedDealer?.name ? selectedDealer.name : 'Select Option'}</DropdownToggle>
                            <DropdownMenu>
                                {dealers.map((dealer, index) => <DropdownItem key={index} onClick={() => handleDealerSelect(dealer)}>{dealer.name}</DropdownItem>)}
                            </DropdownMenu>
                        </Dropdown>
                    </FormGroup>
                </Form> : <p>No dealers found.</p>
                }
            </div>    
        )
    }
    const Builder = (props) => {
        const { templates } = props;

        return (
            <div>
                {templates.map((template, index) => <BuildTemplateCard key={index} template={template} />)}
            </div>
        )
    }

    return (
        <div>
            <h1 className="page-title">Build Template</h1>
            { (!builder && loading) ?
                <Loader />
            : error ? 
                <p>Something went wrong</p>
            : builder ?
                <Builder templates={selectedTemplates}/>
            : 
                <Fragment>
                    <SelectDealer />
                    { selectedDealer && <SelectTemplates /> }
                </Fragment>
            }
            { message && <p>{message}</p> }
        </div>
    )
}

export default BuildTemplate;