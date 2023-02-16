const dbUtilities = require("../utility/dbFunctions/dbUtilities");
const templateDB = require("../utility/dbFunctions/templateDB");
/**
 * 
 * @param {JSON} req.query.projectFields - MongoDB project options JSON object. Ex-{"_id":1,"name":1,"title":0}
 * @param {*} res 
 */
module.exports.getAllTemplates = (req, res) => {

  if (!res.locals || !res.locals.dm_user_information || !res.locals.dm_user_information.account_type) { return res.status(401).json({ error: "User is not logged in" }) }

  const userAccount = res.locals.dm_user_information.account_type;

  try {
    const { projectFields = '{}' } = req.query;
    let filterFields = { "active": true }
    if (userAccount !== "omni") {
      filterFields = { "isPublic": true, ...filterFields }
    }
    const projectObj = JSON.parse(projectFields);
    dbUtilities.readAllDocuments('template_engine', 'templates', projectObj, filterFields)
      .then((data) => {
        res.json(data)
      })
      .catch((e) => {
        console.log(e)
        res.status(500).json(e);
      });

  } catch (e) {
    console.log(e)
    res.status(500).json(e);
  }
}

/**
 * 
 * @param {String {Boolean}} req.query.includePages - Optional: If true, make additional query to get pages data
 * @param {String {ObjectID}} req.query.templateID - Mongodb Object ID
 * @param {*} res 
 */
module.exports.getTemplate = (req, res) => {

  if (!res.locals || !res.locals.dm_user_information || !res.locals.dm_user_information.account_type) { return res.status(401).json({ error: "User is not logged in" }) }

  const userAccount = res.locals.dm_user_information.account_type;
  const { includePages } = req.query;
  const { templateID } = req.params;

  templateDB.getTemplate('template_engine', 'templates', templateID, includePages)
    .then(template => {
      if (userAccount === 'omni' || template.isPublic) { return res.status(200).json(template) }
      return res.status(401).json({error:"User is not authorized to access this template"})
    
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

module.exports.getAvailablePagesForTemplate = (req, res) => {
  if (!res.locals || !res.locals.dm_user_information || !res.locals.dm_user_information.account_type) { return res.status(401).json({ error: "User is not logged in" }) }
  const { templateID } = req.params;
  templateDB.getTemplate('template_engine', 'templates', templateID, true)
    .then(template => {
      return res.status(200).json(template.pages); 
    })
    .catch(err => {
      res.status(500).json(err)
    })
}