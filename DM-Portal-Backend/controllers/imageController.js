const mediaDB = require("../utility/dbFunctions/mediaDB");
const dbUtilities = require('../utility/dbFunctions/dbUtilities');
const { asyncWrapper } = require('../utility/utilityFunctions');
require('dotenv').config();

module.exports.getAllImages = async (req, res) => {
    dbUtilities.readAllDocuments('media', 'images')
        .then(images => {
            res.json(images)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })    
}

