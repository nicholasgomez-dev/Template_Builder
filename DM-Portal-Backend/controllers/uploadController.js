const mediaDB = require("../utility/dbFunctions/mediaDB");
const dbUtilities = require('../utility/dbFunctions/dbUtilities');
const { asyncWrapper } = require('../utility/utilityFunctions');
const AWS = require('aws-sdk');
const crypto = require('crypto');
const fs = require('fs');
const formidable = require('formidable');
require('dotenv').config();

module.exports.getPresignedURL = (req, res) => {
    const s3 = new AWS.S3({
	Bucket: process.env.img_bucket_name,
        signatureVersion: 'v4',
	region: process.env.img_bucket_region
    });
    const imageExtension = 'img/' + req.query.fileExtension; 
    const getSignedUrlforPut = async () => {
    const fileName = crypto.randomBytes(16).toString("hex") + '.png';
    const params = {
	Bucket: process.env.img_bucket_name,
	Key: fileName,
	ContentType: imageExtension,
	Expires: 60 * 5
    };
	
    try {
       const url = await new Promise((resolve, reject) => {
	 s3.getSignedUrl('putObject', params, (err, url) => {
	   err ? reject(err) : resolve(url);
	 });
       });
       const s3URL = (decodeURI(url) + ' | ' + fileName);
       res.send(s3URL)
     } catch (err) {
	if (err) {
	    console.log(err)
	    res.send(err);
	}
       }
     }
     getSignedUrlforPut()    
}

module.exports.storeMetadata = async (req, res) => {
    const imageDataModel = {
	imageTitle: req.query.imageTitle,
	imageTimestamp: req.query.imageTimestamp,
	imageCdnUrl: req.query.imageCdnUrl,
    }
    mediaDB.addImageMetadata('media', 'images', imageDataModel).then((data => { res.json(data) }));
}

