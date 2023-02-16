import React from 'react';
import {
  Row,
  Col,
  Progress,
  Table,
  Label,
  Input,
} from 'reactstrap';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";

import Widget from '../../components/Widget';

import Calendar from './components/calendar/Calendar';
import Map from './components/am4chartMap/am4chartMap';
import Rickshaw from './components/rickshaw/Rickshaw';
import API from 'actions/portalAPI';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'components/Loader';
import InputFormItem from 'components/FormItems/items/InputFormItem';
import SwitchFormItem from 'components/FormItems/items/SwitchFormItem';
import RadioFormItem from 'components/FormItems/items/RadioFormItem';
import ImagesFormItem from 'components/FormItems/items/ImagesFormItem';
import usersFields from 'components/Users/usersFields';
import IniValues from 'components/FormItems/iniValues';
import PreparedValues from 'components/FormItems/preparedValues';
import FormValidations from 'components/FormItems/formValidations';
import { withRouter } from 'react-router-dom';

import AnimateNumber from 'react-animated-number';

import s from './Dashboard.module.scss';

import peopleA1 from '../../images/people/a1.jpg';
import peopleA2 from '../../images/people/a2.jpg';
import peopleA5 from '../../images/people/a5.jpg';
import peopleA4 from '../../images/people/a4.jpg';

  const LoginSchema = Yup.object().shape({
  sitename: Yup.string()
    .required("Site name is required"),
  siteemailaddress: Yup.string()
    .email("Invalid email address format")
    .required("Site email is required")
  });

class Dashboard extends React.Component {	
    
  iniValues = () => {
    return IniValues(usersFields, this.props.record || {});
  }

  formValidations = () => {
    return FormValidations(usersFields, this.props.record || {});
  }

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        }
    }



    handleSubmit = (values, actions) => {
    // const { id, ...data } = PreparedValues(usersFields, values || {});
	// this.props.onSubmit(id, data);
	this.setState({ isLoading: true });
	API.post(`/api/sites/create`, values)
        .then(res => {

	  console.log(this.state.isLoading);
          console.log(res);
          console.log(res.data);
	  console.log(res.status);
	  toast.success( 'Site successfully created!', {
	      autoClose: 7000,
	  });
	  this.props.history.push('/app/main/sites');
      })
     .catch(err => {
	 if (err.response) {
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
      return 'Edit Site';
    }

    return this.props.isEditing
      ? 'Edit Site'
      : 'Create Site';
  };   

    renderForm() {
    return (
      <div className={"create-site"}>
      <Widget title={<h4>{this.title()}</h4>} collapse close>
        <Formik
        onSubmit={this.handleSubmit}
	onChange={this.handleChange}        
        validationSchema={LoginSchema}
          render={(form) => {
            return (
              <form onSubmit={form.handleSubmit}>

                <InputFormItem
                  name={'sitename'}
                schema={usersFields}
	        onchange={this.onChange}
                />
		    
                <InputFormItem
                  name={'siteemailaddress'}
                schema={usersFields}
		onChange={this.onChange}
                />		    

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
      </div>
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

export default withRouter(Dashboard);
