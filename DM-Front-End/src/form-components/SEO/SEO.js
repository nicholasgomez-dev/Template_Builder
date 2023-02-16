import React from 'react'
import {
  Button,
} from 'reactstrap';
import { Formik } from 'formik';
import InputFormItem from 'components/FormItems/items/InputFormItem';
import * as Yup from "yup";
import usersFields from 'components/Users/usersFields';
import './SEO.scss'
import Text from "../Text/Text";

const TagSchema = Yup.object().shape({
tagName: Yup.string()
  .required("Tag name is required"),
tagContent: Yup.string()
  .required("Tag content is required")
});

class SEO extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
      MetaTitle: '',
	  MetaDesc:'',
	  tags: [],
	  selectedTag: '',
	  editState: false,
	  tagClick: false,
	  inputName: '',
	  inputContent: ''	   
      }

      this.state.MetaTitle = props.seoData.MetaTitle
	  this.state.MetaDesc = props.seoData.MetaDesc
	  this.state.tags = props.seoData.tags

	  this.setState({tags: props.seoData.tags})

      this.handleSubmit = this.handleSubmit.bind(this)
      this.handleClick = this.handleClick.bind(this)
      this.handleEdit = this.handleEdit.bind(this)
	  this.handleRemoveClick = this.handleRemoveClick.bind(this)
	  this.updateParent = this.updateParent.bind(this)

  }

    handleSubmit(values, {resetForm}) {
		if (this.state.editState === false) {
			let id = JSON.stringify(values.tagName + values.tagContent)
			console.log(id);
			let setID = values['id'] = id;
			let setEdit = values['editState'] = false
			let tags = this.state.tags;

			tags.push(values)
			this.setState({
				tags: tags
			})

			this.setState({
				editState: false
			});
			resetForm({});
		} else if (this.state.editState === true) {

			let editTag = this.state.tags.filter((tag) => tag.id.includes(this.state.selectedTag));


			this.setState({
				tags: this.state.tags
			})

			let id = JSON.stringify(values.tagName + values.tagContent)
			console.log(id);

			let setID = values['id'] = id;
			let setEdit = values['editState'] = false
			this.state.tags.push(values)

			this.setState({
				tags: this.state.tags
			})

			this.setState({
				editState: false
			});
			resetForm({});

			this.handleRemoveClick({"target":{"dataset":{"mssg": editTag[0].tagName+ "!" +editTag[0].tagContent + "!" + editTag[0].id}}});
		}
		this.updateParent("tags", this.state.tags)
	}

    handleClick(tag, form) {
		this.setState({
			selectedTag: tag.target.dataset.mssg.split('!')[2],
			editState: true
		});
		this.handleEdit(tag)
		console.log(this.state.selectedTag);
		console.log(this.state.editState);
		form.setFieldValue('tagName', tag.target.dataset.mssg.split('!')[0]);
		form.setFieldValue('tagContent', tag.target.dataset.mssg.split('!')[1]);
    }

	// this can be changed to update an object in state
	updateParent(name, value, id, parent) {

		this.setState({
			[name]: value
		}, () => {

			let content = {
				"MetaTitle":this.state.MetaTitle,
				"MetaDesc":this.state.MetaDesc,
				"tags":this.state.tags,
			}

			this.props.updateParent(this.props.name, content, this.props.id)
		})
	}

	handleRemoveClick(tag){

		const id = tag.target.dataset.mssg.split('!')[2];

		let theTags = this.state.tags.filter(function(theTag) {
									return theTag.id !== id
								});

		this.setState({tags: theTags});

		this.updateParent("tags",theTags)
	}

    handleEdit(tag) {
		if(tag.id === this.state.selectedTag) {
			this.setState({tagClick: true})
		} else {
			return false
		}
    }
    
  render() {	
    return (	
	    <div className="seo-cont">
			<div className='array-description'>{this.props.description}</div>
		<div className="seoMetadata">
			<Text updateParent={this.updateParent} title={"Site Title"} description={""} name="MetaTitle" id={"MetaTitle"} inputValue={this.state.MetaTitle} />
			<Text updateParent={this.updateParent} title={"Site Description"} description={""} name="MetaDesc" id={"MetaDesc"} inputValue={this.state.MetaDesc} />
		</div>
			<hr/>
			<br/>
		<Formik
			onSubmit={this.handleSubmit}
			onChange={this.handleChange}
			validationSchema={TagSchema}
          	render={(form) => {
            	return (
		    		<form onSubmit={form.handleSubmit}>
						<h4> Add Meta Tag </h4>
							<InputFormItem
								name={'tagName'}
								schema={usersFields}
								onchange={this.onChange}
							/>
							<InputFormItem
								name={'tagContent'}
								schema={usersFields}
								onChange={this.onChange}
							/>

						<div className="form-buttons">
						  <button
							className="btn btn-primary"
							disabled={(this.state.isLoading, !(form.dirty && form.isValid))}
							type="button"
							onClick={form.handleSubmit}
						  >
							{this.state.editState ? 'Update Tag' : 'Create Tag'}

						  </button>{' '}{' '}
						</div>

						<hr/>
					   <div>
						   <br/>
						   <h4>Tags:</h4>
						  <div className="tagsContainer">
						{
							this.state.tags.map((tag) => (
								<div>
									<Button data-mssg={tag.tagName + '!' + tag.tagContent + '!' + tag.id} onClick={(tag) => this.handleClick(tag, form)} className="tag btn btn-primary">{tag.tagName}: {tag.tagContent}</Button>
									<Button data-mssg={tag.tagName + '!' + tag.tagContent + '!' + tag.id} onClick={(tag) => this.handleRemoveClick(tag, form)} className="removeTag btn btn-secondary">X</Button>
								</div>
							))
						}
						  </div>
						</div>
        			</form>
        		);
       		}}
      	/>
      	<hr/>
      </div>
    )
  }
}

export default SEO

