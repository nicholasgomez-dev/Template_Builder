const { readAllDocuments } = require('../utility/dbFunctions/dbUtilities');
require('dotenv').config();

// Build the connection string
const MongoUri = 'mongodb+srv://test-user:ok7xNR8z8l2DN2MR@contentsentry2.nc7ol.mongodb.net/Template_Builder?retryWrites=true&w=majority'

module.exports = {
    getAllTemplates: (req, res) => {
        readAllDocuments('Template_Builder', 'Templates', {}, {}, MongoUri)
            .then(result => {
                res.json(result)
            })
            .catch(err => {
                console.log(err)
                res.json(err)
            })
    }
}