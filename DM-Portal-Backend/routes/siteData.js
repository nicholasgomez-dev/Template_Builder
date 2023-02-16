let express = require('express');
let router = express.Router();
const siteDataController = require('../controllers/siteDataController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware')

router.get('/', authMiddleware.adminAuthCheck, siteDataController.getAllSitesData); //returns all sites
router.get('/:site_id', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, siteDataController.getSiteDataByID); //returns one site
router.put('/:site_id/pages/:page_id/data', authMiddleware.checkUserSiteAccess, siteDataController.updateSitePageData); //updates site page data
router.post('/:site_id/template', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, siteDataController.assignTemplate);
router.post('/:site_id/addPage', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, siteDataController.addPageToSite);
router.post('/:site_id/deletePage/:page_id', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, siteDataController.deletePageFromSite);
router.get('/:site_id/images', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, siteDataController.getSiteImages);
router.get('/:site_id/getPresignedURL', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, siteDataController.getPresignedURL);
router.post('/:site_id/storeMetadata', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, siteDataController.storeMetadata);
router.get('/:site_id/info', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, siteDataController.getSiteIncludeExistingPages);
router.post('/:site_id/publish', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, siteDataController.initiateSiteBuild);
router.post('/:site_id/publishAll', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, siteDataController.initiateMasterSiteBuild);
router.get('/:site_id/pages/:page_id/data', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, siteDataController.getPageData); // gets saved data for page editing
router.get('/:site_id/settings', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, siteDataController.getSiteSettings); //get siteSettings
router.put('/:site_id/settings', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, siteDataController.updateSiteSettings); //update siteSettings
router.put('/:site_id/siteMetaData', validationMiddleware.checkForValidSiteID, authMiddleware.adminAuthCheck, siteDataController.updateSiteMetaData); //update siteMetaData
router.put('/:site_id/navigation', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, siteDataController.updateSiteNav)
module.exports = router
