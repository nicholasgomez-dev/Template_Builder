let express = require('express');
let router = express.Router();
const inventoryDataController = require('../controllers/inventoryDataController');
const dealerIdMiddleware = require('../middleware/retrieveDealerId')
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

router.get('/:site_id/getInventory/', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, dealerIdMiddleware.getDealerID, inventoryDataController.getDealerInventory) //returns inventory table data
router.get('/:site_id/:vehicleVIN/getLandingInventoryItem/', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, dealerIdMiddleware.getDealerID, inventoryDataController.getLandingInventoryItem) //returns inventory item
router.get('/:site_id/:vehicleVIN/getInventoryItemRules/', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, dealerIdMiddleware.getDealerID, inventoryDataController.getInventoryItemRules) //returns inventory item rules
router.put('/:site_id/putVehicleRules/', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, dealerIdMiddleware.getDealerID, inventoryDataController.putVehicleRules) //puts rules item
router.get('/:site_id/publishInventoryChanges', validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, dealerIdMiddleware.getDealerID, inventoryDataController.mergeInventoryChanges) //invoke combine tables lambda & build lambda
router.post('/:site_id/:dealer_id/getInventoryRules/',validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, dealerIdMiddleware.getDealerID, inventoryDataController.getInventoryRules) //get rules by dealer
router.post('/:site_id/:dealer_id/removeInventoryRule/',validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, dealerIdMiddleware.getDealerID, inventoryDataController.removeInventoryRule) //remove inventory rules by dealerID and ruleID
router.post('/:site_id/:dealer_id/createInventoryRule/',validationMiddleware.checkForValidSiteID, authMiddleware.checkUserSiteAccess, dealerIdMiddleware.getDealerID, inventoryDataController.createInventoryRule) //Create new rule or edit old one
module.exports = router