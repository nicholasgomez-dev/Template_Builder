const jwt = require('jsonwebtoken');
const dbFunctions = require('../utility/dbFunctions/dbUtilities');
const siteDB = require('../utility/dbFunctions/siteDB');
module.exports.verifyJWT = (req, res, next) => {

	if (!req.headers.authorization) { return res.status(401).end(JSON.stringify({ error: 'no authorization header present' })); }
	var auth0ClientSecret = process.env.auth0ClientSecret
	var decoded_jwt = jwt.verify(req.headers.authorization.split(" ")[1], auth0ClientSecret);

	if (!decoded_jwt) { return res.status(401).end(JSON.stringify({ error: "no valid credentials provided" })); }
	res.locals.dm_user_information = {
		user_id: decoded_jwt["dm_record_id"],
		account_type: decoded_jwt["dm_user_type"],
		user_email: decoded_jwt["email"],
		nickname: decoded_jwt["nickname"],
		picture: decoded_jwt["picture"]
	};
	next();
}

module.exports.adminAuthCheck = (req, res, next) => {
	if (!res.locals || !res.locals.dm_user_information || !res.locals.dm_user_information.account_type) { return res.status(401).json({ error: "User is not logged in" }) }
	if (res.locals.dm_user_information.account_type !== "omni") { return res.status(401).json({ error: "User is not authorized for this route" }) }
	next()
}


module.exports.checkUserSiteAccess = (req, res, next) => {
	if (!res.locals || !res.locals.dm_user_information || !res.locals.dm_user_information.account_type) { return res.status(401).json({ error: "User is not logged in" }) }
	if (!res.locals.dm_user_information.user_id) { return res.status(401).json({ error: "Missing user ID" }) }
	if (res.locals.dm_user_information.account_type === "omni") { return next(); }

	const { site_id } = req.params
	siteDB.checkSiteAccessByUser('aws_user_accounts', 'sites', site_id, res.locals.dm_user_information.user_id).then(authenticatedSiteID => {
		if (authenticatedSiteID) { return next() };
		return res.status(400).json({ error: "User is not authorized to this site" })
	}).catch(err => {
		console.log(err)
		return res.status(500).json(err)
	})
}
