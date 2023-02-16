import React from "react"
import './NavLink.scss';
import s from './NavLink.module.scss';
import {
    Row,
    Col,
    Button,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import Select from 'react-select';
import Autocomplete from '@material-ui/lab/Autocomplete';

function NavLink(props) {

    const updateLink = (name, value) => {
        const clonedInput = JSON.parse(JSON.stringify(props.inputValue))
        clonedInput[name] = value
        console.log('cloned', clonedInput)
        props.updateParent(props.node, props.path, props.getNodeKey, clonedInput)
    }
    return (
        <div>

            <Form className="form-label-left">
                <FormGroup row>

                    <Label for="normal-field" md={4} className="text-md-right">
                        Link Name:
                    </Label>
                    <Col md={6}>
                        <Input innerRef={props.focus ? input => input && input.focus() : undefined} type="text" id="normal-field" placeholder="" value={props.inputValue.linkName} name="linkName" onChange={(e) => updateLink(e.target.name, e.target.value)} />
                    </Col>
                </FormGroup>
                <FormGroup row >

                    <Label className="text-md-right" md={4} for="grouped-select">Page Path:</Label>
                    <Col md={6} className={s.select2}>

                    <Input type="text" id="normal-field" placeholder="" value={props.inputValue.linkPath} name="linkPath" onChange={(e) => updateLink(e.target.name, e.target.value)} />
                    </Col>
                    
                </FormGroup>
               
            </Form>
          
        </div>
    )
}

export default NavLink