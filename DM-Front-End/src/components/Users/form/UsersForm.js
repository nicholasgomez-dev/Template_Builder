import { Formik } from 'formik';
import React, { Component } from 'react';
import Loader from 'components/Loader';
import InputFormItem from 'components/FormItems/items/InputFormItem';
import SwitchFormItem from 'components/FormItems/items/SwitchFormItem';
import RadioFormItem from 'components/FormItems/items/RadioFormItem';
import ImagesFormItem from 'components/FormItems/items/ImagesFormItem';
import usersFields from 'components/Users/usersFields';
import IniValues from 'components/FormItems/iniValues';
import PreparedValues from 'components/FormItems/preparedValues';
import FormValidations from 'components/FormItems/formValidations';
import Widget from 'components/Widget';
//import axios from 'axios';
import API from 'actions/portalAPI';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from "yup";
import { withRouter } from 'react-router-dom';

  const LoginSchema = Yup.object().shape({
  first_name: Yup.string()
    .required("First name is required"),
  last_name: Yup.string()
    .required("Last name is required"),
  email_address: Yup.string()
    .email("Invalid email address format")
   .required("Site email is required"),
  role: Yup.string()
    .required("Role must be specified")
  });

class UsersForm extends Component {

    constructor(props) {
	super(props);
	
	this.state = {
	    isLoading: false
	}
    }
    
  iniValues = () => {
    return IniValues(usersFields, this.props.record || {});
  }

  formValidations = () => {
    return FormValidations(usersFields, this.props.record || {});
  }

    handleSubmit = (values, actions) => {

	const username = values.first_name + " " + values.last_name;
	console.log(username);
	
	API.post(`/api/users/initialize-user/`, {
		username: username,
		email_address: values.email_address,
		role: values.role
	})
    .then(res => {
	this.setState({ isLoading: true });		
        console.log(res);
          console.log(res.data);
	  console.log(res.status);
	  toast.success( 'Collaborator user successfully created!', {
	      autoClose: 7000,
	  });
	  this.props.history.push('/admin/users');
      })
     .catch(err => {
	 if (err.response) {
           toast.warning( 'You must fill out all fields' );
	   console.log(err.response.data);
           console.log(err.response.status);
           console.log(err.response.headers);	 
       } else if (err.request) {
	   console.log(err.request);
       } else {
           console.log('Error', err.message);
       }
     })
	.finally(data =>{
            this.setState({isLoading: false})
        })
  };

  title = () => {
    if(this.props.isProfile) {
      return 'Edit My Profile';
    }

    return this.props.isEditing
      ? 'Edit User'
      : 'Add User';
  };   

  renderForm() {

    return (
      <Widget title={<h4>{this.title()}</h4>} collapse close>
        <Formik
        onSubmit={this.handleSubmit}
	onChange={this.handleChange}
        validationSchema={LoginSchema}
          render={(form) => {
            return (
              <form>

                <InputFormItem
                  name={'first_name'}
                schema={usersFields}
	        onchange={this.onChange}
                />
		    
                <InputFormItem
                  name={'last_name'}
                schema={usersFields}
	        onchange={this.onChange}
                />		    
		    
                <InputFormItem
                  name={'email_address'}
                schema={usersFields}
		onChange={this.onChange}
                />

                {
                  <>
                    <RadioFormItem
                      name={'role'}
                      schema={usersFields}
                    />
                  </>
                }		

                <div className="form-buttons">
                  <button
                    className="btn btn-primary"
                    disabled={this.state.isLoading, !(form.dirty && form.isValid)}
                    type="button"
                    onClick={form.handleSubmit}
                    >
         	    {this.state.isLoading ? 'Saving...' : 'Save'}
		
                  </button>{' '}{' '}

                </div>
              </form>
            );
          }}
        />
      </Widget>
    );
  }

  render() {
    const { isEditing, findLoading, record } = this.props;

    if (findLoading) {
      return <Loader />;
    }

    if (isEditing && !record) {
      return <Loader />;
    }

    return this.renderForm();
  }
}

export default withRouter(UsersForm);
