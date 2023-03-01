const express = require('express');
const router = express.Router();
const templateBuilder = require('../controllers/templateBuilderController');
const authMiddleware = require('../middleware/authMiddleware');

// Template Routes
router.get('/templates', authMiddleware.checkUserSiteAccess, templateBuilder.getAllTemplates)
router.get('/templates/search', authMiddleware.checkUserSiteAccess, templateBuilder.getOneTemplate)
router.post('/templates/save', authMiddleware.checkUserSiteAccess, templateBuilder.saveTemplate)
router.post('/templates/update', authMiddleware.checkUserSiteAccess, templateBuilder.updateTemplate)

// Dealer Routes
router.get('/dealers', authMiddleware.checkUserSiteAccess, templateBuilder.getAllDealers)
router.get('/dealers/search', authMiddleware.checkUserSiteAccess, templateBuilder.getOneDealer)
router.post('/dealers/save', authMiddleware.checkUserSiteAccess, templateBuilder.saveDealer)
router.post('/dealers/update', authMiddleware.checkUserSiteAccess, templateBuilder.updateDealer)

// Variable Routes
router.get('/variables', authMiddleware.checkUserSiteAccess, templateBuilder.getAllVariables)
router.get('/variables/search', authMiddleware.checkUserSiteAccess, templateBuilder.getOneVariable)
router.post('/variables/save', authMiddleware.checkUserSiteAccess, templateBuilder.saveVariable)
router.post('/variables/update', authMiddleware.checkUserSiteAccess, templateBuilder.updateVariable)

// Settings Routes
router.get('/settings', authMiddleware.checkUserSiteAccess, templateBuilder.getAllSettings)

module.exports = router;