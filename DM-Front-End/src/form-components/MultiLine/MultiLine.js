import React from "react"
import './MultiLine.scss'

class MultiLine extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
	  inputText: ''	
      };
    }

    updateInput(value) {
	let newlineConv = value.replace(/\r?\n/g, '<br/>');
	this.setState({
	    inputText: value
	});
	this.props.updateParent(this.props.name, newlineConv, this.props.id, this.props.parent)
    }
    
    render() {
       return (
	    <div>
	      <div className="multiLineTitleContainer">	       
	         <span className="multiLineTitle">{this.props.title}</span>
	          <span className="multiLineDescription">{this.props.description}</span>
	      </div>
		  <textarea value={this.state.inputText} className="multiLineModule" name="multiline" onChange={(e) => this.updateInput(e.target.value)} cols="50" rows="5" />
	      </div>
	  )
       }
     }


export default MultiLine
