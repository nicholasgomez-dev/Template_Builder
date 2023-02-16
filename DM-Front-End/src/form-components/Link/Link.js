import React from "react"
import './Link.module.scss';

function Link(props) {

    const updateLink= (value) => {
        this.props.updateParent(this.props.name, value, this.props.id, this.props.parent)
    }

    const toggleTooltip = (element) => {
        element.parentElement.nextSibling.classList.toggle("active")
        this.setState({tooltip: !this.state.tooltip});
    }

    return (
        <div>
            <div className="inputTextTitle">{props.title || "Title"} {(props.description != null && props.description.length > 0 && !props.showDescription
                      ) ? <i class="help-text fa fa-question-circle" 
                      onClick={(e) => {toggleTooltip(e.target)} }></i> : <i></i> }
                  </div>
                { <div id={props.id} className="inputTextDescription">{props.description}</div>
                }
                {props.showDescription ? <p className="persistentDesc">{props.description}</p> : <span></span>}
            <div >
                <div >
                    <label for="linkName">
                        Link Name:
                    </label>
                    <input style={{"display": "block"}} type="text" value={props.inputValue.linkName} className="inputTextModule" name="linkName" onChange={(e) => this.updateLink(e.target.value)} />
                </div>
                <div >
                    <label for="linkPath">
                        Link Path:
                    </label>
                    <input style={{"display": "block"}} type="text" value={props.inputValue.linkPath} className="inputTextModule" name="linkPath" onChange={(e) => this.updateLink(e.target.value)} />
                </div>
            </div>
        </div>
    )
}

export default Link