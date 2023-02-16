import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import Loader from '../../../components/Loader/Loader';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap';
import { isEmpty } from '../../../utilityFunctions'
import s from "./settingsEditForm.module.scss"
import CWidget from '../../../components/CollapsableWidget/CollapsableWidget'
import Text from '../../../form-components/Text/Text';
import RichInput from '../../../form-components/RichText/RichText';
import RawHTML from '../../../form-components/RawHTML/RawHTML';
import ColorSelector from '../../../form-components/ColorSelector/ColorSelector';
import ImageInsert from '../../../form-components/ImageInsert/ImageInsert';
import Array from '../../../form-components/Array/Array';
import Checkbox from '../../../form-components/Checkbox/Checkbox';
import SEO from '../../../form-components/SEO/SEO';
import Select from '../../../form-components/Select/select';
import Date from '../../../form-components/Date/Date'
import Icons from '../../ui-elements/icons/Icons';
class SettingsEditForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            error: false,
            dealership: "Dealership",
            siteSettingsMetadata: [],
            siteSettings: {},
            isLoading: false,
            hasEdits: false,
            isSaving: false,
            updatedValues: {}
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.errorHandler = this.errorHandler.bind(this);
        this.components = {
            text: Text,
            richinput: RichInput,
            rawhtml: RawHTML,
            color: ColorSelector,
            image: ImageInsert,
            array: Array,
            checkbox: Checkbox,
            select: Select,
            seo: SEO,
            date: Date
        }
    }
    async componentDidMount() {
        this.setState({ isLoading: true })
        axios.get(`${process.env.API}/api/sites/${this.props.match.params.site_id}/settings`)
            .then(siteSettings => {
                console.log(siteSettings)
                this.setState({
                    ...siteSettings.data,
                    isLoading: false
                })
            })
            .catch(err => {
                console.log(err)
                this.errorHandler()
                this.setState({ isLoading: false })
            })

    }
    errorHandler = () => {
        this.setState({
            error: true,
            modal: true
        })
    }
    /**
     * 
     * @param {Boolean} isError 
     */
    openModal = (isError = false) => {
        this.setState({
            error: isError,
            modal: true,
        })
    }
    closeModal = () => {
        this.setState({
            modal: false,
            error: false
        })
    }

    updateParent = (name, value, id, parent) => {
        this.setState((prevState) => {
            return ({
                hasEdits: true,
                updatedValues: {
                    ...prevState.updatedValues,
                    [name]: value
                }
            })

        })
    }

    saveEditsHandler = async () => {
        const { updatedValues } = this.state;
        if (isEmpty(updatedValues)) {
            return alert('Settings are already up to date!')
        }


        this.setState({ isSaving: true }, () => {
            console.log('putting')
            return axios.put(process.env.API + `/api/sites/${this.props.match.params.site_id}/settings`, { site_settings: updatedValues })
                .then(result => {
                    this.setState({
                        hasEdits: false,
                        isSaving: false
                    })
                    this.openModal()
                })
                .catch(err => {
                    console.log(err);
                    this.setState({
                        isSaving: false
                    });
                    this.openModal(true)
                })
        })
    }

    previewChangesHandler = () => {

        const { updatedValues } = this.state;
        if (isEmpty(updatedValues)) {
            return alert('Settings are already up to date!')
        }
        
        console.log('preview', updatedValues);
    }

    render() {

        const mapComponents = (siteMetadata, values) => {

            return siteMetadata.reduce((compArr, subComp) => {
                const showFieldDescription = subComp.hasOwnProperty('showDescription') ? subComp.showDescription : false

                if (subComp.hasOwnProperty('auth')) {
                    const userData = JSON.parse(window.localStorage.getItem('user-data'));
                    const { dm_user_type } = userData;

                    if (Object.prototype.toString.call(subComp.auth) === '[object Array]') {
                        if (subComp.auth.indexOf(dm_user_type) === -1) return compArr
                    } 
                    else {
                        if (dm_user_type === subComp.auth) {
                            if (subComp.type.toLowerCase() === "group") {
                                const inputComp = <CWidget key={subComp.identifier} title={subComp.title} collapse>
                                    <p>{subComp.description}</p>
                                    {mapComponents(subComp.content, values)}
                                </CWidget>
                                return [...compArr, inputComp];
                            }
                            else if (subComp.type.toLowerCase() === "array") {
                                // console.log('array', values[subComp.identifier], 'arrayComp', subComp )
                                const inputComp = <CWidget key={subComp.identifier} collapse className="nested-widget">
                                    <Array title={subComp.title} parent={subComp.identifier} values={values} showDescription={showFieldDescription}  description={subComp.description} id={subComp.identifier} name={subComp.identifier} arrayComp={subComp} array={this.state.updatedValues[subComp.identifier] || values[subComp.identifier]} updateParent={this.updateParent} />
                                </CWidget>
                                return [...compArr, inputComp];
                            } else if (subComp.type.toLowerCase() === "seo") {
                                const inputComp =  <CWidget collapse>
                                    <SEO updateParent={this.updateParent} title={subComp.title} showDescription={showFieldDescription} description={subComp.description}   name={subComp.identifier} id={subComp.identifier} seoData={values[subComp.identifier]} />
                                </CWidget>
                                return [...compArr, inputComp];
            
                            } else if (subComp.type.toLowerCase() === "select") {
                                const inputComp =  <CWidget collapse>
                                    {<Select key={subComp.identifier} title={subComp.title} type=""
                                    showDescription={showFieldDescription}
                                    description={subComp.description} options={subComp.content} selectedOption={values[subComp.identifier]} optionValues={values} name={values[subComp.content[1].identifier]} id={subComp.identifier} updateParent={this.updateParent}></Select>
                                    }
                                </CWidget>
                            return [...compArr, inputComp];
                            } 
                            else {
                                const Component = this.components[subComp.type.toLowerCase()]
                                const inputComp = <Component key={subComp.identifier} title={subComp.title} showDescription={showFieldDescription} description={subComp.description} inputValue={this.state.updatedValues[subComp.identifier] || values[subComp.identifier]} id={subComp.identifier} name={subComp.identifier} updateParent={this.updateParent} />
                                return [...compArr, inputComp];
                            }
                        }
                        else {return compArr}
                    }
                }
                else {
                if (subComp.type.toLowerCase() === "group") {
                    const inputComp = <CWidget key={subComp.identifier} title={subComp.title} collapse>
                        <p>{subComp.description}</p>
                        {mapComponents(subComp.content, values)}
                    </CWidget>
                    return [...compArr, inputComp];
                } else if (subComp.type.toLowerCase() === "array") {
                    // console.log('array', values[subComp.identifier], 'arrayComp', subComp )
                    const inputComp = <CWidget key={subComp.identifier} collapse className="nested-widget">
                        <Array title={subComp.title} parent={subComp.identifier} values={values} showDescription={showFieldDescription}  description={subComp.description} id={subComp.identifier} name={subComp.identifier} arrayComp={subComp} array={this.state.updatedValues[subComp.identifier] || values[subComp.identifier]} updateParent={this.updateParent} />
                    </CWidget>
                    return [...compArr, inputComp];
                } else if (subComp.type.toLowerCase() === "seo") {
                    const inputComp =  <CWidget collapse>
                        <SEO updateParent={this.updateParent} title={subComp.title} showDescription={showFieldDescription} description={subComp.description}   name={subComp.identifier} id={subComp.identifier} seoData={values[subComp.identifier]} />
                    </CWidget>
                    return [...compArr, inputComp];

                } else if (subComp.type.toLowerCase() === "select") {
                    const inputComp =  <CWidget collapse>
                        {<Select key={subComp.identifier} title={subComp.title} type=""
                        showDescription={showFieldDescription}
                        description={subComp.description} options={subComp.content} selectedOption={values[subComp.identifier]} optionValues={values} name={values[subComp.content[1].identifier]} id={subComp.identifier} updateParent={this.updateParent}></Select>
                        }
                    </CWidget>
                   return [...compArr, inputComp];
                } 
                else {
                    const Component = this.components[subComp.type.toLowerCase()]
                    const inputComp = <Component key={subComp.identifier} title={subComp.title} showDescription={showFieldDescription} description={subComp.description} inputValue={this.state.updatedValues[subComp.identifier] || values[subComp.identifier]} id={subComp.identifier} name={subComp.identifier} updateParent={this.updateParent} />
                    return [...compArr, inputComp];
                } }

            }, [])
        }

        return (
            <React.Fragment>
                <h2 className="page-title">Edit Page - <span className="fw-semi-bold">{this.state.pageTitle}</span></h2>
                { !this.state.isLoading ?

                    <div>
                        <div className={`${s.button_group}`}>
                            <Button color="success" onClick={this.saveEditsHandler} disabled={this.state.hasEdits === false} > {this.state.isSaving ? "Saving..." : "Save Edits"} </Button>
                            <Button color="primary" onClick={this.previewChangesHandler} disabled={this.state.hasEdits === false} > Preview Changes </Button>
                        </div>

                        {mapComponents(this.state.siteSettingsMetadata, this.state.siteSettings)}

                    </div>
                    : <Loader size={75} />}
                <Modal centered={true} isOpen={this.state.modal}>
                    <ModalHeader toggle={this.closeModal}>{this.state.error ? "Error" : "Success"}</ModalHeader>
                    <ModalBody className="bg-white">

                        <div className="youSure">
                            {this.state.error ? "Oops, something went wrong, please try again." : 'Page changes successfully saved!'}
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="gray" onClick={this.closeModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )

    }

}
function mapStateToProps(store) {
    return {
        sidebarOpened: store.navigation.sidebarOpened,
        sidebarStatic: store.navigation.sidebarStatic,
        navbarType: store.layout.navbarType,
        navbarColor: store.layout.navbarColor,
        openUsersList: store.chat.openUsersList,
        currentUser: store.auth.currentUser,
    };
}

export default withRouter(connect(mapStateToProps)(SettingsEditForm));
