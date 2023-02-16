import React from 'react'
import ImagesUploader from "../../components/FormItems/uploaders/ImagesUploader"
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
import { Formik } from 'formik';
import InputFormItem from 'components/FormItems/items/InputFormItem';
import usersFields from 'components/Users/usersFields';
import * as Yup from "yup";
import './ImageUploadInsert.scss'
import Select from 'react-select';
import uploadLogo from '../../images/selectimage.png';

const ImageSchema = Yup.object().shape({
imageinsertname: Yup.string()
  .required("You must enter an image name")
});

class ImageUploadInsert extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
	  imageSelected: false,
	  imageFile: "",
	  imageExtension: "",
	  files: []
      }
      this.updateImageFileURL = this.updateImageFileURL.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this)      
  }

    handleSubmit(values, {resetForm}) {
      const file = this.state.files;
      this.props.addImage(this.props.name, this.state.imageFile, values.imageinsertname, this.state.imageExtension, file)     
      this.setState({imageSelected: false})
      resetForm({})
  }

  updateImageFileURL(value) {
      const file = URL.createObjectURL(value[0]);    
      const fileExtension = value[0].name.split('.')[1];
      console.log(fileExtension)
      const imageFile = value[0]
      this.setState({imageFile: file})
      this.setState({imageExtension: fileExtension})
      this.setState({files: imageFile})      
      this.props.addInfo(file)
      this.setState({imageSelected: true})           
  }

  toggleTooltip(element) {
    element.parentElement.nextSibling.classList.toggle("active")
    this.setState({tooltip: !this.state.tooltip});
}
    
  render() {
    const imageUploader = React.createRef(null); 	
    return (	
	    <div className="imageInsertContainer">
	    <div className="imageInsertTitleContainer">
	       <span className="imageInsertTitle">{this.props.title} {(this.props.description != null && this.props.description.length > 0 && this.props.showDescription
                      ) ? <i class="help-text fa fa-question-circle" 
                      onClick={(e) => {this.toggleTooltip(e.target)} }></i> : <i></i> }
                  </span>
                { <div id={this.props.id} className="inputTextDescription">{this.props.description}</div>
                }
	    </div>
	    <Formik
	      onSubmit={this.handleSubmit}
	      validationSchema={ImageSchema}
	      render={(form) => {  	    
              return (		  
		  <form className="imageInsertForm" onSubmit={form.handleSubmit}>
                    <input
                      accept="image/*" onChange={(e) => this.updateImageFileURL(e.target.files)}
		      id="fileupload2"
		      ref={imageUploader}
                      type="file" name="imageinsert" className="display-none"
                      />
              <div className="imageSelector fileinput fileinput-new fileinput-fix">
                  <div onClick={() => imageUploader.current.click()} className="fileinput-new thumbnail">
                      {(this.props.previewURL.length > 1 && this.state.imageSelected) ?  <div>
                          <img name="imageinsert" alt="..." src={this.props.previewURL} />
                      </div> : <img
                          alt="..."
                          src={uploadLogo}
                      />}
                  </div>
              </div>
              <div>
		    <div className="imageInsertInputContainer">
                {/*<div className="imageInsertURLContainer">
	              <Button className="imageInsertURLButton" type="button" color="primary"> <Label for="fileupload2">Select Image</Label></Button>
		      </div> */}

		      <div className="imageInsertURLContainer">
				<InputFormItem name={'imageinsertname'} schema={usersFields} value={this.props.inputNameValue} className="imageInsertURLInput" onChange={(e, val) => this.updateImageName(e, val) }/>		    
		      </div>
	          <Button onClick={(this.state.imageSelected && form.isValid) ? form.handleSubmit : console.log("Wait to Upload")} disabled={(!this.state.imageSelected && !form.isValid) || (this.state.imageSelected && !form.isValid)} className="imageInsertURLButton" type="button" color={(this.state.imageSelected && form.isValid) ? "success" : "primary"}>{this.props.loading ? 'Uploading...' : 'Upload'}</Button>
		    </div>

            </div>
	    </form>
	    );
          }}
          />
       </div>
     )
  }
}

export default ImageUploadInsert
