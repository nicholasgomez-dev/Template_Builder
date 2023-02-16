import React, { Component } from 'react';
import ProductCard from './components/ProductCard/ProductCard';
import s from './Products.module.scss';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import axios from 'axios'
import Loader from '../../components/Loader/Loader';
class Templates extends Component {
    constructor() {
        super()

        this.state = {
            data: [],
            filter: [],
            selected: '',
            loading: true,
            modal: false,
            templateOpened: {},
            error: false,
            alreadySelected: false,
            siteName: '',
            siteID: '',
            template: {}
        }

        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.errorHandler = this.errorHandler.bind(this)
    }

    async componentDidMount() {
        await this.checkSiteInfo()

        axios.get(process.env.API + '/api/templates/?projectFields={"_id":1,"title":1,"templateThumbnail":1}')
            .then(response => {
                let json = response.data
                console.log(json)
                this.setState({
                    data: json,
                    filter: json,
                    loading: false
                })
            })
            .catch(error => {
                console.log(error.response)

                if (error.response.status >= 500) this.errorHandler()
            })
    }

    // This will be used to get the siteName and alreadySelected once the backend API (dmwp-93) is merged into development
    checkSiteInfo() {
        return new Promise((resolve, reject) => {
            axios.get(process.env.API + '/api/sites/' + this.props.match.params.id)
                .then(async (response) => {
                    let site = response.data

                    this.setState({
                        siteName: site.siteMetadata.siteName,
                        siteID: site._id
                    })

                    if (site.siteMetadata.currentTemplateID !== '') {
                        const template = await this.getTemplate(site.siteMetadata.currentTemplateID)

                        this.setState({
                            alreadySelected: true,
                            template: template
                        })
                    }

                    resolve()
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.status >= 404) resolve(error) // resolves still because there is no site data
                    if (error.response.status >= 500) this.errorHandler()

                    reject(error)
                })

        })
    }

    getTemplate(id) {
        return new Promise((resolve, reject) => {
            axios.get(process.env.API + '/api/templates/' + id)
                .then(response => {
                    let json = response.data

                    resolve(json)
                })
                .catch(error => {
                    console.log(error.response)

                    reject(error)

                    if (error.response.status >= 500) this.errorHandler()
                })
        })
    }

    openModal(template) {
        this.setState({
            modal: true,
            templateOpened: template
        })
    }

    closeModal(name) {
        this.setState({
            [name]: false
        })
    }

    templateSelected(template) {
        this.closeModal('modal')

        this.setState({
            loading: true
        })

        axios.post(process.env.API + '/api/sites/' + this.props.match.params.id + '/template', {
            template: template._id
        })
            .then(() => {
                // Notification using toast
                toast.success('Template has been successfuly assigned!', {
                    position: "top-center",
                    autoClose: 7000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                })

                this.setState({
                    alreadySelected: true,
                    template: template,
                    loading: false
                })
            })
            .catch(error => {
                console.log(error.response)

                if (error.response.status >= 500) this.errorHandler()
            })
    }

    errorHandler() {
        this.setState({
            error: true
        })
    }

    filterTemplates(e) {
        let templateSearch = this.state.data.filter(template => template.title.toLowerCase().includes(e.target.value.toLowerCase())) // filters out templates with title's that do not contain input value

        this.setState({
            filter: templateSearch
        })
    }

    render() {
        let loading = (<Loader size={75} />) // loading indicator
        let placeholder = (<div>No Templates Found!</div>) // Incase there are no templates after searching

        let templates = this.state.filter.map(item => { // looping through json array of templates
            return (<ProductCard selected={this.state.selected} key={item._id} item={item} openModal={this.openModal} />)
        })

        if (templates.length === 0) templates = placeholder // if no templates available, render placeholder
        if (this.state.loading === true) templates = loading // if api call is still loading, render loading icon
        if (this.state.alreadySelected) return ( // if the site already has a templete assigned to them, render message
            <div>
                <div>
                    <h1 className="page-title"><span className="fw-semi-bold">Template Select</span> - {this.state.siteName}</h1>
                    <div>A Template has already been assigned to this site.</div>
                    <div className={s.selectedTemplate}>
                        <h2 className={s.templateName}>{this.state.template.name}</h2>
                        <img className={s.templateImage} src={this.state.template.templateThumbnail} />
                    </div>
                </div>
                <Modal isOpen={this.state.error}>
                    <ModalHeader toggle={() => this.closeModal('error')}>Error</ModalHeader>
                    <ModalBody className="bg-white">
                        <div className="youSure">Oops, something went wrong, please try again.</div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="gray" onClick={() => this.closeModal('error')}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )

        return (
            <div>
                <div>
                    <h1 className="page-title"><span className="fw-semi-bold">Template Select</span> - {this.state.siteName}</h1>
                    <div>
                        <input type="text" onChange={(e) => this.filterTemplates(e)} placeholder="Search Templates" className={s.tempInput} />
                    </div>
                    <div className={s.productsListElements}>
                        {templates}
                    </div>
                </div>
                <Modal isOpen={this.state.modal}>
                    <ModalHeader toggle={() => this.closeModal('modal')}>Confirm Template</ModalHeader>
                    <ModalBody className="bg-white">
                        <div className="youSure">You are about to select this template: {this.state.templateOpened.title}</div>
                        <br></br>
                        <div className="youSure">This action can't be undone. Are you sure you would like to continue?</div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="gray" onClick={() => this.closeModal('modal')}>Close</Button>
                        <Button onClick={() => this.templateSelected(this.state.templateOpened)} color="primary">Confirm</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.error}>
                    <ModalHeader toggle={() => this.closeModal('error')}>Error</ModalHeader>
                    <ModalBody className="bg-white">
                        <div className="youSure">Oops, something went wrong, please try again.</div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="gray" onClick={() => this.closeModal('error')}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default withRouter(Templates);


