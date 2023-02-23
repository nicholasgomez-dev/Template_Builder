const express = require('express');
const router = express.Router();
const { getAllTemplates, getAllDealers, getAllVariables, getAllHistory } = require('../controllers/templateBuilderController');

// Template Routes
router.get('/templates', getAllTemplates)

// Dealer Routes
router.get('/dealers', getAllDealers)

// Variable Routes
router.get('/variables', getAllVariables)

// History Routes
router.get('/history', getAllHistory)

module.exports = router;