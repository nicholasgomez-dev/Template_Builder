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
import styles from './publishButton.module.scss'
//props
class PublishButton extends React.Component {
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
    handlePublishButton = (e) => {
        e.preventDefault();
        this.setState({isLoading: true}, (() => {
            axios.post(`${process.env.API}/api/sites/${this.props.site_id}/publish`)
            .then(data => {this.openModal()})
            .catch(err => this.openModal(true))
        }))

    }

    render() {
        return (
            <React.Fragment >
                <Button onClick={this.handlePublishButton} id="t-tip" color={this.props.color} >{this.state.isLoading ? "Publishing..." : "Publish"}</Button>
                <Tooltip className={styles["publish-tooltip"]} placement={this.props.toolTipDirection} onClick={this.toggleTooltip} isOpen={this.state.tooltipOpen} target="t-tip">
                    <div style={{ "textAlign": "right" }} >X</div>
                    <p>You have pending changes to your site. Click here to publish these changes!</p>
                </Tooltip>
                <Modal centered={true} isOpen={this.state.modal}>
                    <ModalHeader toggle={this.closeModal}>{this.state.error ? "Error" : "Success"}</ModalHeader>
                    <ModalBody className="bg-white">

                        <div className="youSure">
                            {this.state.error ? "Oops, something went wrong, please try again." : 'Your site is being published! We’re working now to make sure your customers have an awesome experience. The changes you made will appear on the  live site in about 20 minutes.'}
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

PublishButton.propTypes = {
    site_id: PropTypes.string.isRequired,
    color: PropTypes.string,
    isPublished: PropTypes.bool.isRequired,
};
PublishButton.defaultProps = {
    color: 'success',
    toolTipDirection: 'top'
}

export default PublishButton;