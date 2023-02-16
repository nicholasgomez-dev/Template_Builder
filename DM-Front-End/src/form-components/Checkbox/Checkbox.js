
import React from "react"
import {
    FormGroup,
    Label,
    Input
  } from 'reactstrap';
import './Checkbox.scss';
import PropTypes from 'prop-types';

function Checkbox(props) {
    
    const updateValue = (oldValue) => {
        const newValue = !oldValue;
        props.updateParent(props.name, newValue, props.id, props.parent)
    }
    const checkedStyle={
        "paddingRight": 0,
        "paddingLeft": "20px",
        "background": "#21AE8C"
    }
    const toggleTooltip = (element) => {
        element.parentElement.nextSibling.classList.toggle("active")
        this.setState({tooltip: !this.state.tooltip});
    }
    return (
        
        <FormGroup className="display-inline-block checkbox-ios">
                        <div className="inputTextTitle">{props.title || "Title"} {(props.description != null && props.description.length > 0 && !props.showDescription
                      ) ? <i class="help-text fa fa-question-circle" 
                      onClick={(e) => {toggleTooltip(e.target)} }></i> : <i></i> }
                  </div>
                { <div id={props.id} className="inputTextDescription">{props.description}</div>
                }
                {props.showDescription ? <p className="persistentDesc">{props.description}</p> : <span></span>}
            <Label  for="checkbox-ios1" className="switch">
                <Input
                    type="text" className="ios" defaultChecked={props.inputValue} 
                    id="checkbox-ios1"
                /><i style={props.inputValue ? checkedStyle : {}} onClick={(e) => updateValue(props.inputValue)}/>
            </Label>
        </FormGroup>
    )
}

Checkbox.defaultProps = {
    inputValue: false
}
Checkbox.propTypes = {
    inputValue: PropTypes.bool,
    title: PropTypes.string.isRequired,
    description: PropTypes.string
}
export default Checkbox
