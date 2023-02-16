let express = require('express')
let router = express.Router();
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:site_id/getImages', imageController.getAllImages);

module.exports = router
