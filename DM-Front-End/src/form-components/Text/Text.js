import React from "react"
import './Text.scss'
import { Form, FormGroup, Label, Input, FormFeedback, FormText, Tooltip } from 'reactstrap';

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
class Text extends React.Component {

    //const [tooltipOpen, setTooltipOpen] = useState(false);

    //const toggle = () => setTooltipOpen(!tooltipOpen);

    constructor(props) {
        super(props);
        this.state = {
            tooltip: false
        };
    }

    toggleTooltip(element) {
        element.parentElement.nextSibling.classList.toggle("active")
        this.setState({tooltip: !this.state.tooltip});
    }

    updateText(value) {
        this.props.updateParent(this.props.name, value, this.props.id, this.props.parent)
    }
    render() {
        return (
            <FormGroup>
                 
                  <div className="inputTextTitle">
                      {this.props.title}
                      {(this.props.description != null && this.props.description.length > 0 && !this.props.showDescription
                      ) ? <i class="help-text fa fa-question-circle" 
                      onClick={(e) => {this.toggleTooltip(e.target)} }></i> : <i></i> }
                  </div>
                { <div id={this.props.id} className="inputTextDescription">{this.props.description}</div>}
                {this.props.showDescription ? <p className="persistentDesc">{this.props.description}</p> : <span></span>}
                <Input className="inputTextModule" style={{width: "unset"}} invalid={this.props.invalid ? true: false} type="text" value={this.props.inputValue} className="inputTextModule" name="text" onChange={(e) => this.updateText(e.target.value)}/>
                <FormFeedback>{this.props.invalidText || "invalid input!"}</FormFeedback>
                
            </FormGroup>
        )    
    }
}

export default Text