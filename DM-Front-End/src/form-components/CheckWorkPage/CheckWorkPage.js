import React from "react"
import Text from '../Text/Text'
import RichInput from '../RichText/RichText'
import RawHTML from '../RawHTML/RawHTML'
import ColorSelector from '../ColorSelector/ColorSelector'
import Array from '../Array/Array'
import pretty from 'pretty'
import { v4 as uuidv4 } from 'uuid';
import MultiLine from '../MultiLine/MultiLine'
import ImageInsert from '../ImageInsert/ImageInsert'
import SEO from '../SEO/SEO'

class CheckWork extends React.Component {
    constructor() {
        super()

        this.state = {
            multiline: "",
            imageinsert: "",
            text: "", // text component
            seo: {
                    MetaTitle:"",
                    MetaDesc:"",
                    tags:[]
                },
            richText: "<p></p>", // rich text
            rawHTML: pretty(`<div><div className="inputTextTitle">{props.title}</div><div className="inputTextDescription">{props.description}</div></div>`), // rawHTMl component
            color: '#a32121', // color component
            array: [], // array component
            arrayComp: {
                id: uuidv4(),
                title: "Home Page",
                data: [
                    {
                        id: uuidv4(),
                        componentSet: [
                            {
                                type: "RawHTML",
                                title: "raw",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            },
                            {
                                type: "Text",
                                title: "text",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            },
                            {
                                type: "SEO",
                                title: "seo",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            },
                            {
                                type: "RichInput",
                                title: "rich",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            },
                            {
                                type: "ColorSelector",
                                title: "color",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            }        
                        ]
                    },
                    {
                        id: uuidv4(),
                        componentSet: [
                            {
                                type: "RawHTML",
                                title: "raw",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            },
                            {
                                type: "Text",
                                title: "text",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            },
                            {
                                type: "SEO",
                                title: "seo",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            },
                            {
                                type: "RichInput",
                                title: "rich",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            },
                            {
                                type: "ColorSelector",
                                title: "color",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            }        
                        ]
                    },
                    {
                        id: uuidv4(),
                        componentSet: [
                            {
                                type: "RawHTML",
                                title: "raw",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            },
                            {
                                type: "Text",
                                title: "text",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            },
                            {
                                type: "SEO",
                                title: "seo",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            },
                            {
                                type: "RichInput",
                                title: "rich",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            },
                            {
                                type: "ColorSelector",
                                title: "color",
                                description: "test array desc",
                                value: '',
                                id: uuidv4()
                            }        
                        ]
                    }
                ],
                baseComponents: [
                    {
                        type: "RawHTML",
                        title: "raw",
                        description: "test array desc",
                        value: ''
                    },
                    {
                        type: "Text",
                        title: "text",
                        description: "test array desc",
                        value: ''
                    },
                    {
                        type: "SEO",
                        title: "seo",
                        description: "test array desc",
                        value: ''
                    },
                    {
                        type: "RichInput",
                        title: "rich",
                        description: "test array desc",
                        value: ''
                    },
                    {
                        type: "ColorSelector",
                        title: "color",
                        description: "test array desc",
                        value: ''
                    }
                ]
            },
        }

        this.updateParent = this.updateParent.bind(this)	
    }

    // this can be changed to update an object in state
    updateParent(name, value, id, parent) {
        this.setState({
            [name]: value
        })

    }
    
    // This needs to be removed 
    updateParentOLD(e) {
        let target = e.target
        const name = target.name
        let value = target.value.replace(/\r?\n/g, '<br/>')
	if (target.files) {
	    const file = URL.createObjectURL(target.files[0]);
	    this.setState({
		[name]: file
	    });
	    console.log(this.state.imageinsert)
	} else {
	    this.setState({
		[name]: value
	    });
	}
	console.log(this.state.multiline);
	console.log(this.state.imageinsert);
    }

    render() {
        return (
            <div>
                <SEO updateParent={this.updateParent} title={"SEO"} description={"SEO"}  name="seo" id={"seo"} seoData={this.state.seo} />
                <Text updateParent={this.updateParent} title={"Test Title"} description={"Test Description"} name="text" id={"text"} inputValue={this.state.text} />
                <RichInput updateParent={this.updateParent} title={"Test Title"} description={"Test Description"} name={"richText"} id={"richText"} inputValue={this.state.richText} />
                <RawHTML updateParent={this.updateParent} title={"Test Title"} description={"Test Description"} name={"rawHTML"} id={"rawHTML"} inputValue={this.state.rawHTML} />
                <ColorSelector updateParent={this.updateParent} title={"Test Title"} description={"Test Description"} name={"color"} id={"color"} inputValue={this.state.color} />
                <Array updateParent={this.updateParent} title={"Array Title"} description={"Array Description"} name={"array"} id={"array"} array={this.state.array} arrayComp={this.state.arrayComp} />
                {/* <ImageInsert updateParent={this.updateParent} title={"Image Insert"} description={"Upload Image to Dealer Masters"} name={"imageinsert"} id={"imageinsert"} inputValue={this.state.imageinsert} /> */}
            </div>
        )
    }
}

export default CheckWork
