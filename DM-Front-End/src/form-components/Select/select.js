import React, { useState, Component } from "react"
import "./select.scss";
import { Form, FormGroup, Label, Input, FormFeedback, FormText, Dropdown, DropdownToggle, DropdownMenu, DropdownItem  } from 'reactstrap';
// class Text extends React.Component {
//     constructor(props) {
//         super(props)
//     }

//     updateText(value) {
//         this.props.updateParent(this.props.name, value, this.props.id, this.props.parent)
//     }

//     render() {
//         return (
//             <div>
//                 <div className="inputTextTitle">{this.props.title}</div>
//                 <div className="inputTextDescription">{this.props.description}</div>
//                 <input type="text" value={this.props.inputValue} className="inputTextModule" name="text" onChange={(e) => this.updateText(e.target.value)}/>
//             </div>
//         )    
//     }
// }
const Select = (props) => {

    //const selectedValueID = props.options[1].identifier
    //setSelectedValue(props.optionValues[0].value[selectedValueID])

    const dropdownOptionsID = props.options[0].identifier
    //console.log(props.optionValues[dropdownOptionsID])

    //const rawValues = props.optionValues[0].value[dropdownOptionsID]
    const rawValues = props.optionValues[dropdownOptionsID];
    const textID = props.options[0].componentSet[0].identifier
    const valueID = props.options[0].componentSet[1].identifier

    let selectedOption = props.selectedOption

    
   // const [tooltip] = useState(false);

    //const toggle = () => setTooltipOpen(!tooltipOpen);

    if(props.type === "array") {
     // console.log(props)
     // console.log(props.id)
     // console.log(selectedOption)
    }

    const extractOptions = () => {
      let optionsList = [];
      
      rawValues.forEach(element => {
        let processedOption = {
          text: element.value[textID],
          value: element.value[valueID]
        }
        optionsList.push(processedOption);
      });

      return optionsList
    }

   const updateDropdown = (target, value) => {
    //  selectedOption = value
   //   target.value = selectedOption
      props.updateParent(props.id, value, props.id, props.parent)
  }

  const toggleTooltip = (element) => {
    element.parentElement.nextSibling.classList.toggle("active")
  }

    return (
        <FormGroup>
          <div className="inputTextTitle">
          { props.title }
          {(props.description != null && props.description.length > 0 && !props.showDescription
                      ) ? <i class="help-text fa fa-question-circle" 
                      onClick={(e) => {toggleTooltip(e.target)} }></i> : <i></i> }
          </div>
                { <div id={props.id} className="inputTextDescription">{props.description}</div>
                }
                {props.showDescription ? <p className="persistentDesc">{props.description}</p> : <span></span>}
                <select className="inputDropdown" onChange={(e) => {updateDropdown(e.target, e.target.value);}}>
                    {extractOptions().map((result, index) => { 
                        return <option key={index} value={result.value} selected={(selectedOption == result.value)}>{result.text}</option>
                        })
                    }
                </select>
        </FormGroup>
    )    
                      }
export default Select

/*

import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const Example = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret>
        Dropdown
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Header</DropdownItem>
        <DropdownItem>Some Action</DropdownItem>
        <DropdownItem text>Dropdown Item Text</DropdownItem>
        <DropdownItem disabled>Action (disabled)</DropdownItem>
        <DropdownItem divider />
        <DropdownItem>Foo Action</DropdownItem>
        <DropdownItem>Bar Action</DropdownItem>
        <DropdownItem>Quo Action</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

*/