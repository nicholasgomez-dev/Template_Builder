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
    Button,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import { Formik } from 'formik';
import { isEmpty } from '../../../utilityFunctions'
import s from "./editPage.module.scss"
import CWidget from '../../../components/CollapsableWidget'
import Text from '../../../form-components/Text/Text';
import RichInput from '../../../form-components/RichText/RichText';
import RawHTML from '../../../form-components/RawHTML/RawHTML';
import ColorSelector from '../../../form-components/ColorSelector/ColorSelector';
import ImageInsert from '../../../form-components/ImageInsert/ImageInsert';
import Array from '../../../form-components/Array/Array';

import Checkbox from '../../../form-components/Checkbox/Checkbox';
import SEO from '../../../form-components/SEO/SEO';
import flatten from 'flat';
import Select from '../../../form-components/Select/select';
import ComponentDate from '../../../form-components/Date/Date.js';

class EditPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            error: false,
            deleteModal: false,
            dealership: "Dealership",
            pageMetadata: [],
            values: {},
            slug: "",
            pageTitle: "",
            masterPage: false,
            isLoading: false,
            hasEdits: false,
            isSaving: false,
            isdeleting: false,
            updatedValues: {},
            slugValidated: true
        };
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.errorHandler = this.errorHandler.bind(this);
        this.components = {
            text: Text,
            richinput: RichInput,
            rawhtml: RawHTML,
            color: ColorSelector,
            image: ImageInsert,
            array: Array,
            seo: SEO,
            checkbox: Checkbox,
            select: Select
        }
    }
    async componentDidMount() {
        this.setState({ isLoading: true })
        axios.get(`${process.env.API}/api/sites/${this.props.match.params.site_id}/pages/${this.props.match.params.page_id}/data`)
            .then(pageData => {
                const {  otherPages, slug, ...data } = pageData.data;
                const pageSlugs = otherPages.map(el => {
                    const { slug, pageTitle } = el
                    return {
                        slug,
                        pageTitle
                    }
                })
                
                if (!localStorage.getItem("recentPages")){
                    localStorage.setItem("recentPages", "{}")
                }

                let recentPages = JSON.parse(localStorage.getItem("recentPages"))
                let siteId = this.props.match.params.site_id;
                let pageId = this.props.match.params.page_id;
                if (! (siteId in recentPages)){
                    recentPages[siteId] = []
                }

                recentPages[siteId] = recentPages[siteId].filter(function (el){
                    return el.pageId != pageId
                })

                if (recentPages[siteId].length > 9){
                    recentPages[siteId].pop()
                }

                let thisRecentPage = {
                    pageId: pageId,
                    pageTitle: data.pageTitle,
                    pageUrl: slug,
                }

                thisRecentPage.dateVisited = new Date();

                recentPages[siteId].unshift(thisRecentPage)

                localStorage.setItem("recentPages", JSON.stringify(recentPages))

                this.pageSlugsValidator(slug, pageSlugs)
                return this.setState({
                    ...data,
                    slug,
                    otherPages: pageSlugs,
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
    openDeleteModal = () => {
        this.setState({ deleteModal: true })
    }
    closeDeleteModal = () => {
        this.setState({ deleteModal: false })
    }
    updateParent = (name, value, id, parent) => {
        if (name === "slug" || name === "pageTitle" || name === "masterPage") {
            if(name === "slug") this.pageSlugsValidator(value, this.state.otherPages);
            this.setState({
                hasEdits: true,
                [name]: value
            })
        } else {

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

    }

    saveEditsHandler = async () => {
        const { slug, pageTitle, masterPage, updatedValues } = this.state;
        let putValues;
        if (isEmpty(updatedValues)) {
            putValues = { //formatted this way to support MongoDB set method
                slug,
                pageTitle,
                masterPage
            }
        } else {
            putValues = { //formatted this way to support MongoDB set method
                slug,
                pageTitle,
                masterPage,
                content: updatedValues
            }
        }

        this.setState({ isSaving: true }, () => {
            return axios.put(process.env.API + `/api/sites/${this.props.match.params.site_id}/pages/${this.props.match.params.page_id}/data`, { pageData: putValues })
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
    
    deletePageHandler = () => {
      this.setState({ isDeleting: true, deleteModal: false }, () => {
        return axios.post(process.env.API + `/api/sites/${this.props.match.params.site_id}/deletePage/${this.props.match.params.page_id}`, { "page_id": this.props.match.params.page_id })
          .then(result => {
            this.props.history.push(`/app/main/sites/${this.props.match.params.site_id}/pages/`)
          })
          .catch(err => { 
            console.log(err);
            this.setState({ isDeleting: false });
            this.openModal(true)
          })
      })
    }

    previewChangesHandler = () => {
        console.log('preview')
        const { dealership, pageMetadata, values, isLoading, hasEdits, isSaving, modal, error, ...updatedValues } = this.state;
        const { slug, pageTitle, ...content } = updatedValues;
        let putValues;
        if(Object.keys(content).length === 0) {
            putValues = { //formatted this way to support MongoDB set method
                slug,
                pageTitle
            }
        } else {
            putValues = { //formatted this way to support MongoDB set method
                slug,
                pageTitle,
                content: content
            }
        }


    }

    pageSlugsValidator = (slug, otherPages) => {
           const isInvalid =  otherPages.some(el => el.slug === slug)
           if(isInvalid) return this.setState({slugValidated: false})
           return this.setState({slugValidated: true})
    }

    render() {
        const mapComponents = (pageMetadata, values) => {
            return pageMetadata.reduce((compArr, subComp, currentIndex) => {
                const showFieldDescription = subComp.hasOwnProperty('showDescription') ? subComp.showDescription : false
                if(subComp.prop.toLowerCase() == "imageLink") {
                    console.log(subComp)
                   // console.log("SHOW DESCRIPTION: " + subComp.title + " " + subComp.showDescription);
                }
                if (subComp.auth) {
                    const userData = JSON.parse(window.localStorage.getItem('user-data'));
                    const { dm_user_type } = userData;

                    if (Object.prototype.toString.call(subComp.auth) === '[object Array]') {
                        if (subComp.auth.indexOf(dm_user_type) === -1) return compArr
                    } else {
                        if (dm_user_type === subComp.auth) return compArr
                    }
                }
                if (subComp.type.toLowerCase() === "group") {
                    const inputComp = <CWidget key={subComp.identifier} title={subComp.title} collapsed={false}>
                        <p>{subComp.description}</p>
                        {mapComponents(subComp.content, values)}
                    </CWidget>
                    return [...compArr, inputComp];
                } else if (subComp.type.toLowerCase() === "array") {
                    const inputComp = <CWidget key={subComp.identifier} collapse className="nested-widget">
                        <Array title={subComp.title} parent={subComp.identifier} values={values} showDescription={showFieldDescription} description={subComp.description} id={subComp.identifier} name={subComp.identifier} arrayComp={subComp} array={this.state.updatedValues[subComp.identifier] || values[subComp.identifier]} updateParent={this.updateParent} />
                    </CWidget>
                    return [...compArr, inputComp];
                }  else if (subComp.type.toLowerCase() === "seo") {
                    const inputComp =  <CWidget collapse>
                        <SEO updateParent={this.updateParent} title={subComp.title} showDescription={showFieldDescription} description={subComp.description} name={subComp.identifier} id={subComp.identifier} seoData={values[subComp.identifier]} />
                    </CWidget>
                    return [...compArr, inputComp];

                } else if (subComp.type.toLowerCase() === "select") {
                    const inputComp = <Select key={subComp.identifier} title={subComp.title} type=""
                        showDescription={showFieldDescription}
                        description={subComp.description} options={subComp.content} selectedOption={values[subComp.identifier]} optionValues={values} name={values[subComp.content[1].identifier]} id={subComp.identifier} updateParent={this.updateParent}></Select>
                    return [...compArr, inputComp];

                }
                else if (subComp.type.toLowerCase() === "date") {
                    const inputComp =
                        <ComponentDate key={subComp.identifier} title={subComp.title} showDescription={showFieldDescription} description={subComp.description} inputValue={this.state.updatedValues[subComp.identifier] || values[subComp.identifier]} id={subComp.identifier} name={subComp.identifier} updateParent={this.updateParent}>
                        </ComponentDate>
                    return [...compArr, inputComp];

                }   else {
                    const Component = this.components[subComp.type.toLowerCase()]
                    const inputComp = <Component key={subComp.identifier} title={subComp.title} showDescription={showFieldDescription} description={subComp.description} inputValue={this.state.updatedValues[subComp.identifier] !== undefined ? this.state.updatedValues[subComp.identifier] : values[subComp.identifier]} id={subComp.identifier} name={subComp.identifier} updateParent={this.updateParent} />
                    return [...compArr, inputComp];
                }

            }, [])

        }

        return (
            <React.Fragment>
                <h2 className="page-title">Edit Page - <span className="fw-semi-bold">{this.state.pageTitle}</span></h2>
                { !this.state.isLoading ?

                    <div>
                        <div className={`${s.button_group}`}>
                            <Button color="success" onClick={this.saveEditsHandler} disabled={(this.state.hasEdits === false || this.state.slugValidated === false)} > {this.state.isSaving ? "Saving..." : "Save Edits"} </Button>
                            <Button color="warning" style={{ "marginLeft":"auto" }} onClick={this.openDeleteModal} disabled={(this.state.slugValidated === false)}> {this.state.isDeleting ? "Deleting..." : "Delete Page"} </Button>
                            {/*<Button color="primary" onClick={this.previewChangesHandler} disabled={(this.state.hasEdits === false || this.state.slugValidated === false)} > Preview Changes </Button>*/}
                        </div>
                        <CWidget title="Page Url and Title" close collapse >
                            <Text title="Slug" description="The URL of the page" inputValue={this.state.slug} id="slug" name="slug" updateParent={this.updateParent} invalid={!this.state.slugValidated} invalidText="There is another page with this path, please try another path!"/>
                            <Text title="Page Title" description="Title of Page" inputValue={this.state.pageTitle} id="pageTitle" name="pageTitle" updateParent={this.updateParent} />
                            {JSON.parse(localStorage.getItem('user-data')).dm_user_type == 'omni'
                            ? <Checkbox title="Master Page" description="Page can be used in imported projects" inputValue={this.state.masterPage} 
                            id="masterPage" name="masterPage" updateParent={this.updateParent} /> 
                            : <></>}
                        </CWidget>

                        {mapComponents(this.state.pageMetadata, this.state.values)}

                    </div>
                    : <Loader size={75}/>}
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
                <Modal centered={true} isOpen={this.state.deleteModal}>
                    <ModalHeader toggle={this.closeDeleteModal}>Delete Page</ModalHeader>
                    <ModalBody className="bg-white">

                        <div className="youSure">
                            Are you sure you would like to delete this page?
                        </div>

                    </ModalBody>
                    <ModalFooter>
                      <Button color="gray" onClick={this.closeDeleteModal}>Cancel</Button>
                      <Button color="gray" onClick={this.deletePageHandler}>Confirm</Button>
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

export default withRouter(connect(mapStateToProps)(EditPage));
