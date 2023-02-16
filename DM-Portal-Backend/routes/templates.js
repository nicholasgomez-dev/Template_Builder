let express = require('express')
let router = express.Router();
const templateController = require('../controllers/templateController');
const authMiddleware = require('../middleware/authMiddleware');

// router.post('/create', templateController) // Renders home page
router.get('/:templateID', templateController.getTemplate); //return one template
router.get('/', templateController.getAllTemplates);
router.get('/:templateID/pages', templateController.getAvailablePagesForTemplate);

module.exports = router