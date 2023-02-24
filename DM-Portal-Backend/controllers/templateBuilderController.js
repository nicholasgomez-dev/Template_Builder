const { readAllDocuments } = require('../utility/dbFunctions/dbUtilities');
require('dotenv').config();

module.exports = {
    // Template Controllers
    getAllTemplates: (req, res) => {
        readAllDocuments('Template_Builder', 'Templates', {}, {}, process.env.TB_MONGO_URI)
            .then(result => {
                res.json(result)
            })
            .catch(err => {
                console.log(err)
                res.json(err)
            })
    },
    // Dealer Controllers
    getAllDealers: (req, res) => {
        readAllDocuments('Template_Builder', 'Dealers', {}, {}, process.env.TB_MONGO_URI)
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
    },
    // Variable Controllers
    getAllVariables: (req, res) => {
        readAllDocuments('Template_Builder', 'Variables', {}, {}, process.env.TB_MONGO_URI)
            .then(result => {
                res.json(result)
            })
            .catch(err => {
                console.log(err)
                res.json(err)
            })
    },
    // History Controllers
    getAllHistory: (req, res) => {
        readAllDocuments('Template_Builder', 'History', {}, {}, process.env.TB_MONGO_URI)
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
    },
    // History Controllers
    getAllSettings: (req, res) => {
        readAllDocuments('Template_Builder', 'Settings', {}, {}, process.env.TB_MONGO_URI)
        .then(result => {
            res.json(result[0])
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
    }
}