
import React from 'react'
import ImagesUploader from "../../components/FormItems/uploaders/ImagesUploader"
import Gallery from '../Gallery/Gallery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import './ImageInsert.scss'
import Select from 'react-select';
import uploadLogo from '../../images/selectimage.png';

class ImageInsert extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tooltip: false
  };
  }

  updateImageFileURL(value) {
      const file = URL.createObjectURL(value[0]);
      this.props.updateParent(this.props.name, file, this.props.id, this.props.parent)	
  }

  updateGalleryImageURL(value){
      //send this.id for both name & id in the updateParent function to make editPage.js & Array.js work with Image insert
      this.updateParent(this.id, value, this.id, this.parent)
  }

  updateImageURL(value) {
      this.props.updateParent(this.props.name, value, this.props.id, this.props.parent)
  }
  
  toggleTooltip(element) {
    console.log(element.parentElement)
    element.parentElement.nextSibling.classList.toggle("active")
    this.setState({tooltip: !this.state.tooltip});
}
    
  render() {
    const imageUploader = React.createRef(null); 	
    return (	
	    <div className="form-group">
	    <div className="imageInsertTitleContainer">
	       <div className="imageInsertTitle">{this.props.title}{(this.props.description != null && this.props.description.length > 0 && !this.props.showDescription
                      ) ? <i class="help-text fa fa-question-circle" 
                      onClick={(e) => {this.toggleTooltip(e.target)} }></i> : <i></i> }
                  </div>
                { <div id={this.props.id} className="inputTextDescription">{this.props.description}</div>}
                {this.props.showDescription ? <p className="persistentDesc">{this.props.description}</p> : <span></span>}
	    </div>
	    <div className="imageInsertURLContainer">
	       <label htmlFor="imageinsert">URL:</label>
	       <input name="imageinsert" value={this.props.inputValue} className="imageInsertURLInput" onChange={(e) => this.updateImageURL(e.target.value)}/>
	      <Gallery
              name="Gallery"
              title="Gallery"
              updateParent={this.props.updateParent}
              updateImageURL={this.updateGalleryImageURL}
              key={this.props.title}
              id={this.props.id}
              inputValue={this.props.value}
              description={this.props.description}
              parent={this.props.parent}
          />
            {/*<Button className="imageInsertURLButton" type="button" color="primary"><Label for={`fileupload2-${this.props.id}`}>Select Image</Label></Button>*/}
	    </div>
	    <Form>
                <FormGroup row>
                  <Col md="8">
                    <input
                      accept="image/*" onChange={(e) => this.updateImageFileURL(e.target.files)}
		      id={`fileUpload2-${this.props.id}`}
		      ref={imageUploader}
                      type="file" name="imageinsert" className="display-none"
                    />
                    <div className="fileinput fileinput-new fileinput-fix">
                      <div onClick={() => imageUploader.current.click()} className="fileinput-new thumbnail">
                        {this.props.inputValue.length > 1 ? <div>
                         <img name="imageinsert" alt="..." src={this.props.inputValue} />
                         </div> : <img
                          alt="..."
                         src={uploadLogo}
                         />}
	               </div>
		    </div>
	    
                    <div>

                    </div>
                  </Col>
            </FormGroup>
	    </Form>	    
       </div>
      )
  }
}


export default ImageInsert
