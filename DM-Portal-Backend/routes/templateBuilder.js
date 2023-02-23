const express = require('express');
const router = express.Router();
const { getAllTemplates } = require('../controllers/templateBuilderController');

router.get('/templates', getAllTemplates)
module.exports = router;