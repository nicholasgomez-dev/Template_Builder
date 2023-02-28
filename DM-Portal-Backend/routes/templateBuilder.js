const express = require('express');
const router = express.Router();
const { getAllTemplates, getAllDealers, getAllVariables, getAllHistory, getAllSettings, getOneTemplate, saveTemplate, saveDealer, getOneDealer, updateDealer, updateTemplate, getOneVariable, saveVariable, updateVariable } = require('../controllers/templateBuilderController');

// Template Routes
router.get('/templates', getAllTemplates)
router.get('/templates/search', getOneTemplate)
router.post('/templates/save', saveTemplate)
router.post('/templates/update', updateTemplate)

// Dealer Routes
router.get('/dealers', getAllDealers)
router.get('/dealers/search', getOneDealer)
router.post('/dealers/save', saveDealer)
router.post('/dealers/update', updateDealer)

// Variable Routes
router.get('/variables', getAllVariables)
router.get('/variables/search', getOneVariable)
router.post('/variables/save', saveVariable)
router.post('/variables/update', updateVariable)

// History Routes
router.get('/history', getAllHistory)

// Settings Routes
router.get('/settings', getAllSettings)

module.exports = router;