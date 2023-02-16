let express = require('express')
let router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

// router.post('/create', templateController) // Renders home page
router.get('/getPresignedURL', uploadController.getPresignedURL); //Get presigned link from AWS
//router.get('/putPresignedURL', uploadController.putPresignedURL);
//Store presigned link in Mongo
router.post('/storeMetadata', uploadController.storeMetadata);
module.exports = router
