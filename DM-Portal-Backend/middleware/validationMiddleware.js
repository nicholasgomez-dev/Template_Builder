const dbFunctions = require('../utility/dbFunctions/dbUtilities');

module.exports.checkForValidSiteID = (req, res, next) => {
	const { site_id } = req.params
    const isValidObjID = dbFunctions.isValidObjectIDCheck(site_id)
    if ( !isValidObjID ) return res.status(400).json({error: "invalid site_id"});
    else { next(); }
}