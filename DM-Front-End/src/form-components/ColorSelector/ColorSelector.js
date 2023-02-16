import React from "react"
import './ColorSelector.scss'
import ColorPicker from 'rc-color-picker';

class ColorSelector extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            new: this.props.inputValue,
            old: this.props.inputValue
        }
    }

    updateColor(value) {
        this.setState({
            new: value
        })

        this.props.updateParent(this.props.name, value, this.props.id, this.props.parent)
    }

    resetColor(value) {
        this.setState({
            old: value,
            new: value
        })

        this.props.updateParent(this.props.name, value, this.props.id, this.props.parent)
    }

    setDefault() {
        this.setState({
            new: '#000000',
            old: '#000000'
        })
    }

    toggleTooltip(element) {
        element.parentElement.nextSibling.classList.toggle("active")
        this.setState({tooltip: !this.state.tooltip});
    }

    render() {
        return (
            <div className="color-root">
                <div className="color-title">{this.props.title} {(this.props.description != null && this.props.description.length > 0 && !this.props.showDescription
                      ) ? <i class="help-text fa fa-question-circle" 
                      onClick={(e) => {this.toggleTooltip(e.target)} }></i> : <i></i> }
                  </div>
                { <div id={this.props.id} className="inputTextDescription">{this.props.description}</div>
                }
                {this.props.showDescription ? <p className="persistentDesc">{this.props.description}</p> : <span></span>}
                <div className="color-flex">
                    <ColorPicker className={'colorBox'} color={this.state.new} defaultColor={this.props.inputValue} onChange={(e) => this.updateColor(e.color)} />
                    <div className="color-hex">{this.state.new  === '' ? this.setDefault() : this.state.new}</div>
                    <button className="color-button" onClick={() => { this.resetColor(this.state.old) }}><i className="las la-undo-alt"></i></button>
                </div>
            </div>
        )
    }
}

export default ColorSelector 