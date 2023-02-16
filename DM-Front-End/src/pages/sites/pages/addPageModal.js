import React from 'react';
import {
  Row,
  Col,
  Button,
  Modal,
  Badge,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
} from 'reactstrap';
import Loader from '../../../components/Loader/Loader'
import Text from '../../../form-components/Text/Text';
import axios from 'axios';
import './addPageModal.modules.scss';

class AddPageModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      active: false,
      loading: false,
      modal: false,
      pages: [],
      selectedPage: undefined,
      pageCreateLoading: false,
      slugForm: false,
      slug: "",
      pageTitle: "",
      slugValidated: true
    }
    this.toggleModalState = this.toggleModalState.bind(this);
    this.selectCardHandler = this.selectCardHandler.bind(this);
    this.createPageHandler = this.createPageHandler.bind(this);
  }

  toggleModalState(id) {
    this.setState(prevState => ({
      [id]: !prevState[id]
    }));

  }
 toggleCreationModal = (id) => {
  this.setState(prevState => ({
    [id]: !prevState[id],
    selectedPage: undefined,
    slug: "",
    pageTitle: ""
  }));
 }
  selectCardHandler(id, slug, pageTitle) {
    this.pageSlugsValidator(slug, this.props.sitePages)
    this.setState({ selectedPage: id, slug: slug, pageTitle: pageTitle })
  }

  fetchPages(templateID) {
    return axios.get(process.env.API + `/api/templates/${templateID}/pages`)
  }

  updateParent = (name, value, id, parent) => {

      if (name === "slug") this.pageSlugsValidator(value, this.props.sitePages);
      this.setState({
        hasEdits: true,
        [name]: value
      })
    
    }
  pageSlugsValidator = (slug, otherPages) => {
    const isInvalid = otherPages.some(el => el.slug === slug)
    if (isInvalid) return this.setState({ slugValidated: false })
    return this.setState({ slugValidated: true })
  }
  createPageHandler() {
    this.setState({ pageCreateLoading: true }, () => {
      return axios.post(process.env.API + `/api/sites/${this.props.siteID}/addPage`, { "page_id": this.state.selectedPage, "slug": this.state.slug, "pageTitle": this.state.pageTitle })
        .then(result => {
          this.setState({ pageCreateLoading: false });
          this.props.history.push(`/app/main/sites/${this.props.siteID}/pages/${result.data.pageID}`)
        })
        .catch(err => { console.log(err); this.props.handleErrors(); })
    })

  }
  render() {

    const { demo, scrollingLong, modal, small, launch, slugForm } = this.state;
    return (
      <div style={{ "float": "right" }}>


        <Button className="mr-sm" color="success" onClick={() => this.toggleModalState('modal')}>Add New Page</Button>

        {/* Modals */}

        <Modal size="lg" className='pageModal' isOpen={modal} toggle={() => this.toggleModalState('modal')}>
          <ModalHeader toggle={() => this.toggleModalState('modal')}>Select A Page</ModalHeader>
          <ModalBody className="bg-white">
            <Row>
              {!this.state.loading ? this.props.pages.map((page, i) => {
                return (
                  <Col key={page.pageData._id} lg="4" md="6" sm="12" >
                    <PageCard selectedPage={this.state.selectedPage} selectHandler={this.selectCardHandler} id={page.pageData._id} slug={page.pageData.slug} pageTitle={page.pageData.pageTitle} pageType={page.pageData.pageType} description={page.pageData.description} />
                  </Col>
                )
              }) : ""}
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onClick={() => this.toggleModalState('modal')}>Close</Button>
            <Button disabled={!this.state.selectedPage} onClick={() => this.toggleModalState('slugForm')} color="success">
              {this.state.pageCreateLoading ? <Loader /> : "Create Page"}
            </Button>
          </ModalFooter>
        </Modal>
              {/* second modal for entering in page title and slug */}
        <Modal isOpen={slugForm} toggle={() => this.toggleModalState('slugForm')}>
          <ModalHeader toggle={() => this.toggleModalState('slugForm')}>Page Path and Title</ModalHeader>
          <ModalBody className="bg-white">
            <Text title="Slug" description="The URL of the page" inputValue={this.state.slug} id="slug" name="slug" updateParent={this.updateParent} invalid={!this.state.slugValidated} invalidText="There is another page with this path, please try another path!" />
            <Text title="Page Title" description="Title of Page" inputValue={this.state.pageTitle} id="pageTitle" name="pageTitle" updateParent={this.updateParent} />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.toggleModalState('slugForm')}>Close</Button>
            <Button color="success" onClick={this.createPageHandler} >{this.state.pageCreateLoading ? <Loader /> : "Finalize Creation"}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

function PageCard(props) {
  const isSelected = (props.selectedPage === props.id);
  const cardClassList = isSelected ? "mb-xlg pageCard isSelected" : "mb-xlg pageCard";
  return (
    <Card id={props.id} onClick={() => props.selectHandler(props.id, props.slug, props.pageTitle)} className={cardClassList} style={{ position: 'relative' }}>
      {/* <CardImg top width="100%" src={props.img || 'https://demo.flatlogic.com/sing-app-react/static/media/mountains.jpeg'} alt="Card image cap" /> */}

      {isSelected ? <span className="selectedColor" style={{ position: 'absolute', top: 0, left: 0, color: 'white' }}><span style={{ top: 0, verticalAlign: "top", margin: "3px" }} className="glyphicon glyphicon-check md-check"></span></span> : ''}
      <CardBody>
        <CardTitle style={{ 'fontSize': '1.5rem', 'fontWeight': 500 }}><span className="fw-semi-bold">{props.pageTitle}</span> </CardTitle>
        <hr />
        <CardText>
          {props.description}
        </CardText>
        {/*<Button className="border-0" color="default">See Live Example</Button>*/}
      </CardBody>
    </Card>
  )
}

const iconMatchObj = {
  "Contact": <i className="fa fa-phone"></i>,
  "Home": <i className="fa fa-home"></i>,
  "Service": <i className="fa fa-wrench"></i>,
  "MissingPageIcon": <i className="fa fa-question"></i>
}
export default AddPageModal;
