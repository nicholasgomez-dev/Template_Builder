import React from 'react'
import {
    Button,
    Tooltip,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from 'reactstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import styles from './publishAllButton.module.scss'
//props
class PublishAllButton extends React.Component {
    constructor(props) {
        super(props);
        //need site_id
        this.state = {
            isLoading: false,
            tooltipOpen: false,
            modal: false,
            error: false
        }
    }
    errorHandler = () =>{
        this.setState({
            error: true,
            modal: true
        })
    }
    /**
     * 
     * @param {Boolean} isError 
     */
    openModal = (isError=false) => {
        this.setState({
            error: isError,
            modal: true,
            isLoading: false,
            tooltipOpen: false
        })
    }
    closeModal = () =>{
        this.setState({
            modal: false,
            error: false
        })
    }
    componentDidMount = () => {
        if (!this.props.isPublished) {
            this.setState({ tooltipOpen: true })
        }
    }
    checkForSiteChanges = (site_id) => {

    }
    toggleTooltip = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        })
    }
    handlePublishAllButton = (e) => {
        e.preventDefault();
        this.setState({isLoading: true}, (() => {
            axios.post(`${process.env.API}/api/sites/${this.props.site_id}/publishAll`)
            .then(data => {this.openModal()})
            .catch(err => this.openModal(true))
        }))

    }

    render() {
        return (
            <React.Fragment >
                <Button onClick={this.handlePublishAllButton} id="t-tip" color={this.props.color} >{this.state.isLoading ? "Publishing All..." : "Publish All"}</Button>
                <Tooltip className={styles["publish-tooltip"]} placement={this.props.toolTipDirection} onClick={this.toggleTooltip} isOpen={this.state.tooltipOpen} target="t-tip">
                    <div style={{ "textAlign": "right" }} >X</div>
                    <p>You have pending changes to your master site. Click here to publish these changes!</p>
                </Tooltip>
                <Modal centered={true} isOpen={this.state.modal}>
                    <ModalHeader toggle={this.closeModal}>{this.state.error ? "Error" : "Success"}</ModalHeader>
                    <ModalBody className="bg-white">

                        <div className="youSure">
                            {this.state.error ? "Oops, something went wrong,please try again." : 'Your master site is being published! We’re working now to make sure your customers have an awesome experience. The changes you made will appear on the  live site in about 20 minutes.'}
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

PublishAllButton.propTypes = {
    site_id: PropTypes.string.isRequired,
    color: PropTypes.string,
    isPublished: PropTypes.bool.isRequired,
};
PublishAllButton.defaultProps = {
    color: 'success',
    toolTipDirection: 'top'
}

export default PublishAllButton;