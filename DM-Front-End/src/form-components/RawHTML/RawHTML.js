import React from "react"
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import './RawHTML.scss'

class rawHTML extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltip: false
        };
    }

    updateRawHTML(value) {
        this.props.updateParent(this.props.name, value, this.props.id, this.props.parent)
    }

    toggleTooltip(element) {
        element.parentElement.nextSibling.classList.toggle("active")
        this.setState({tooltip: !this.state.tooltip});
    }

    render() {
        return (
            <div className="rawHtml-root">
                <div className="rawHtml-title">{this.props.title} {(this.props.description != null && this.props.description.length > 0 && !this.props.showDescription
                      ) ? <i class="help-text fa fa-question-circle" 
                      onClick={(e) => {this.toggleTooltip(e.target)} }></i> : <i></i> }
                  </div>
                { <div id={this.props.id} className="inputTextDescription">{this.props.description}</div>
                }
                {this.props.showDescription ? <p className="persistentDesc">{this.props.description}</p> : <span></span>}
                <CodeMirror value={this.props.inputValue} options={{ mode: 'htmlmixed', theme: 'material', lineNumbers: false }} onBeforeChange={(editor, data, value) => this.updateRawHTML(value)} />
            </div>
        )

    }
}

export default rawHTML