const express = require('express');
const router = express.Router();
const { getAllTemplates, getAllDealers, getAllVariables, getAllHistory, getAllSettings, getOneTemplate } = require('../controllers/templateBuilderController');

// Template Routes
router.get('/templates', getAllTemplates)
router.get('/templates/search', getOneTemplate)

// Dealer Routes
router.get('/dealers', getAllDealers)

// Variable Routes
router.get('/variables', getAllVariables)

// History Routes
router.get('/history', getAllHistory)

// Settings Routes
router.get('/settings', getAllSettings)

module.exports = router;