import React from 'react';
import {
  Button,
  ButtonGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

import { Formik } from 'formik';
import axios from 'axios';
import API from 'actions/uploadAPI';
import FormData from 'form-data';
import ImageInsert from '../ImageInsert/ImageInsert'
import ImageUploadInsert from '../ImageUploadInsert/ImageUploadInsert'
import Lightbox from 'react-images';
import s from './Gallery.module.scss';
import './Gallery.scss';
import config from '../../config'
import {ModalTitle} from "react-bootstrap";


class Gallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageinsert: '',
      imageinsertname: '',
      imageinsertextension: '',
      imageinsertpreview: '',
      imagefile: [],
      images: [],
      currentImage: 0,
      lightboxIsOpen: false,
      isOpen: false,
      isLoading: false,
      children: [],
      activeGroup: 'all',
      order: 'desc',
      theme: {
        arrow: {
          ':focus': {
            outline: 0,
          },
        },
        close: {
          ':focus': {
            outline: 0,
          },
        },
      },
    };

    this.getAllImages = this.getAllImages.bind(this);      
    this.addInfo = this.addInfo.bind(this);       
    this.addName = this.addName.bind(this);       
    this.addURL = this.addURL.bind(this);       
    this.addImage = this.addImage.bind(this);      
    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.gotoImage = this.gotoImage.bind(this);
    this.handleClickImage = this.handleClickImage.bind(this);
    this.openLightbox = this.openLightbox.bind(this);

  }

    getAllImages() {
	  const currentSiteID = window.location.href.split("/")[7];
	    //console.log(currentSiteID);
      const getImages = `${process.env.API}/api/sites/`+ currentSiteID + '/images';
        //console.log(getImages);
      axios.get(getImages).then(res => {
		  const images = res.data;
		  this.setState({ images });
		  this.orderChildren(this.state.order);
          if(this.state.images.length === 0){
            this.setState({hasImages: false});
          }else{
            this.setState({hasImages: true});
          }
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
  }

  componentDidMount() {
      this.getAllImages();
  }

  addInfo(value) {
    this.setState({
	imageinsertpreview: value
    })
  }

  addURL(name, value, imageName, imageExtension, imageFile) {
    this.setState({
	[name]: value,
	imageinsertname: imageName,
	imageinsertextension: imageExtension,
	imagefile: imageFile,
	isLoading: true,
    }, () => {this.addImage()})
  }

  addName(value) {
    this.setState({
	imageinsertname: value
    })
  }   

  addImage() {
      const currentSiteID = window.location.href.split("/")[7];	
      const generatePutUrl = `${process.env.API}/api/sites/` + currentSiteID + '/getPresignedURL';
      const putMetadata = `${process.env.API}/api/sites/` + currentSiteID + '/storeMetadata';
      const file = this.state.imagefile;
      const fileExtension = this.state.imageinsertextension;
      const today = new Date().toLocaleDateString();
      const cdnBaseURL = config.media_base_url;
      const headers = { 'Content-Type': 'application/json', }

      //Generates presigned URL from S3
      axios.get(generatePutUrl, { params: { fileExtension: fileExtension}}).then(res => {
	  console.log("S3 Presigned URL generated ------>" + res);
	  const s3URL = res.data.split(' | ')[0];
	  const cdnImageURL = cdnBaseURL + res.data.split(' | ')[1];
      //Uses presigned URL to upload to S3 	  
      API.put(s3URL, file).then(res => {
	  console.log("File uploaded to S3 ------>" + res.data);
          const metadata = {
	      imageTitle: this.state.imageinsertname,
	      imageTimestamp: today,
	      imageCdnUrl: cdnImageURL,
	      siteID: currentSiteID,
	  }
	  //Posts image metadata to database
	  axios.post(putMetadata, null, {headers: headers, params: metadata} )
	      this.setState({isLoading: false});
          this.getAllImages();
      }).catch(err => {
	  console.log("Upload to S3 failed" + res.data);	  
          this.setState({message:'Sorry, something went wrong'})
          console.log('err', err);	    
      }).finally(data => {
	    this.getAllImages();
      })
    });      
  }

  handleOpenModal = () => {
    this.setState({ isOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isOpen: false });
  };
  selectImage(url){
    this.props.updateImageURL(url)
    this.handleCloseModal()
  }
  openLightbox(index, event) {
    event.preventDefault();
  /*  this.setState({
      currentImage: index,
      lightboxIsOpen: true,
    });*/
  }

  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  }

  gotoImage(index) {
    this.setState({
      currentImage: index,
    });
  }

  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  }

  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  }

  handleClickImage() {
    if (this.state.currentImage === this.state.images.length - 1) return;

    this.gotoNext();
  }

  filterChildren(type) {
    this.setState({
      images: type === 'all' ? this.state.images : this.state.images.filter((child) => {
        const group = child.groups.find(item => item === type);
        return !!group;
      }),
      activeGroup: type,
    });
  }

  orderChildren(order) {
    const images = this.state.images.sort((a, b) => {
      const nameA = a.imageTimestamp.toLowerCase();
      const nameB = b.imageTimestamp.toLowerCase();

      if (nameA < nameB) {
        return order === 'asc' ? -1 : 1;
      }

      if (nameA > nameB) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });

    this.setState({ images, order });

  }

  render() {
    return (
      <div className={s.root}>
            {/*<h1 className="page-title">Media - <span className="fw-semi-bold">Images</span>
               </h1>*/}
	    <Button color="success" onClick={ this.handleOpenModal }>Select Image</Button>
        {/* <ImageInsert updateParent={this.updateParent} title={"Image Insert"} description={"Upload Image to Dealer Masters"} name={"imageinsert"} id={"imageinsert"} inputValue={this.state.imageinsert} />*/}
	    <Modal className="modalContent" isOpen={this.state.isOpen} onCloseModal={this.handleCloseModal}>
            <ModalHeader>
              <ModalTitle>
                <label>My Images</label>
                <button type="button" onClick={this.handleCloseModal}  className={"close array-button"} data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </ModalTitle>
            </ModalHeader>
          <ModalBody className="bg-white">

            <ImageUploadInsert className="imageSelection" addImage={this.addURL} addInfo={this.addInfo} addName={this.addName} title={"Upload New Image"} description={""} name={"imageinsert"} titleName={"imageinsertname"} id={"imageinsert"} previewURL={this.state.imageinsertpreview} loading={this.state.isLoading} inputValue={this.state.imageinsertpreview} inputNameValue={this.state.imageinsertname} />
            <hr/>
            <div className="imageInsertTitle selectImageTitle">Select Image</div>
        <div className={s.galleryControls}>
          {/*} <ButtonGroup id="shuffle-buttons">
            <Button color="default" onClick={() => this.filterChildren('all')} active={this.state.activeGroup === 'all'}>All</Button>
            <Button color="default" onClick={() => this.filterChildren('nature')} active={this.state.activeGroup === 'nature'}>Nature</Button>
            <Button color="default" onClick={() => this.filterChildren('people')} active={this.state.activeGroup === 'people'}>People</Button>
            <Button color="default" onClick={() => this.filterChildren('space')} active={this.state.activeGroup === 'space'}>Space</Button>
            </ButtonGroup>*/}

          <ButtonGroup id="order-buttons">
            <Button color="default" onClick={() => this.orderChildren('desc')} active={this.state.order === 'desc'}><i className="fa fa-sort-numeric-desc" /></Button>
            <Button color="default" onClick={() => this.orderChildren('asc')} active={this.state.order === 'asc'}><i className="fa fa-sort-numeric-asc" /></Button>
          </ButtonGroup>
        </div>
            {this.state.hasImages ? <span></span> : <label>There are no images available.</label>}
        <div className={s.gallery}>
          {this.state.images.map((image, index) => {
            const key = image.imageTitle + index;
            return (
              <div key={key} className={`${s.picture} card`}>
                {/*<a href={image.imageCdnUrl} onClick={e => this.openLightbox(index, e)}/>*/}
                <img className="figure-img" src={image.imageCdnUrl} alt="..." />
                <div className="description">
                  <div className={"ImageDescription"}>
                    <h6 className="mt-0 mb-xs">{image.imageTitle}</h6>
                    <ul className="post-links">
                      <li>
                        <li><button className="btn-link">{image.imageTimestamp}</button></li>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <Button className={"ImageDescriptionRight"} color="success" onClick={() => this.selectImage(`${image.imageCdnUrl}`) }>Select Image</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
            <div className={"close-btn"}>
              <Button className={"array-button"} color="primary" onClick={this.handleCloseModal}>Close</Button>
            </div>
            {/*<Lightbox
          currentImage={this.state.currentImage}
          images={this.state.images}
          isOpen={this.state.lightboxIsOpen}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          onClose={this.closeLightbox}
          onClickImage={this.handleClickImage}
          onClickThumbnail={this.gotoImage}
          backdropClosesModal
          enableKeyboardInput
          theme={this.state.theme}
            />*/}
	    </ModalBody>
          <ModalFooter className="modalFooter">
            </ModalFooter>
	    </Modal>
      </div>
    );
  }

}

export default Gallery;
