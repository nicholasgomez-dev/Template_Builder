import React from "react";
import draftToHtml from 'draftjs-to-html'
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import { Button } from 'reactstrap'
import Switch from 'react-switch'
import "./RichText.scss";
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class RichInput extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            editorState: EditorState.createEmpty(),
            html: '',
            checked: false
        }

        this.onChange = (editorState) => {
            let raw = convertToRaw(editorState.getCurrentContent())
            let html = draftToHtml(raw, {}, true)

            this.setState({
                editorState: editorState,
                html: html
            })

            this.handleRichEditor(html)
        }

        this.textArea = React.createRef()
        this.richArea = React.createRef()
        this.switchToggle = this.switchToggle.bind(this)
    }

    componentDidMount() {
        this.handleHtml(this.props.inputValue)
    }

    handleHtml(value) {
        const blocksFromHTML = convertFromHTML(value);
        const state = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap,
        );

        this.setState({
            html: value,
            editorState: EditorState.createWithContent(state)
        })

        this.handleRichEditor(value)
    }

    handleRichEditor(data) {
        this.props.updateParent(this.props.name, data, this.props.id, this.props.parent)
    }

    changeView(showDiv, hideDiv) {
        showDiv.current.style.display = 'block'
        hideDiv.current.style.display = 'none'
    }

    switchToggle(checked) {
        this.setState({
            checked: checked
        })
    }

    toggleTooltip(element) {
        element.parentElement.nextSibling.classList.toggle("active")
        this.setState({tooltip: !this.state.tooltip});
    }

    render() {
        return (
            <div>
                <h3 className="richTitle">{this.props.title} {(this.props.description != null && this.props.description.length > 0 && this.props.showDescription
                      ) ? <i class="help-text fa fa-question-circle" 
                      onClick={(e) => {this.toggleTooltip(e.target)} }></i> : <i></i> }
                  </h3>
                { <div id={this.props.id} className="inputTextDescription">{this.props.description}</div>
                }
                {this.props.showDescription ? <p className="persistentDesc">{this.props.description}</p> : <span></span>}
                <div className='richContainer'>
                    <div className="richFlex">
                        <div className="htmlSwitch">HTML View</div>
                        <Switch onChange={this.switchToggle} checked={this.state.checked} uncheckedIcon={false} checkedIcon={false} height={22} onColor={"#03426D"} />
                    </div>
                    <div ref={this.richArea} className="RichText" style={ this.state.checked === false ? { display: 'block' } : { display: 'none' } }>
                        <div className="RichEditor-root rootDiv">
                            <Editor
                                editorState={this.state.editorState}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={this.onChange}
                                name={this.props.name}
                            />
                        </div>
                    </div>
                    <div ref={this.textArea} className="htmlRoot" style={ this.state.checked === true ? { display: 'block' } : { display: 'none' } }>
                        <textarea onChange={(e) => this.handleHtml(e.target.value)} value={this.state.html} className="richTextArea"></textarea>
                    </div>
                </div>
            </div>
        )
    }
}