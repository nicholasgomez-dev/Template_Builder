const { readAllDocuments, insertDocument, updateDocumentField } = require('../utility/dbFunctions/dbUtilities');
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
    getOneTemplate: (req, res) => {
        readAllDocuments('Template_Builder', 'Templates', {}, req.query, process.env.TB_MONGO_URI)
            .then(result => {
                console.log(result)
                res.json(result)
            })
            .catch(err => {
                console.log(err)
                res.json(err)
            })
    },
    saveTemplate: (req, res) => {
        insertDocument('Template_Builder', 'Templates', req.body, process.env.TB_MONGO_URI)
            .then(result => {
                res.json(result)
            })
            .catch(err => {
                console.log(err)
                res.json(err)
            })
    },
    updateTemplate: (req, res) => {
        updateDocumentField('Template_Builder', 'Templates', req.query._id, {}, '', req.body, process.env.TB_MONGO_URI)
        .then(result => {
            console.log(result)
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
    getOneDealer: (req, res) => {
        readAllDocuments('Template_Builder', 'Dealers', {}, req.query, process.env.TB_MONGO_URI)
            .then(result => {
                console.log(result)
                res.json(result)
            })
            .catch(err => {
                console.log(err)
                res.json(err)
            })
    },
    updateDealer: (req, res) => {
        updateDocumentField('Template_Builder', 'Dealers', req.query._id, {}, '', req.body, process.env.TB_MONGO_URI)
            .then(result => {
                console.log(result)
                res.json(result)
            })
            .catch(err => {
                console.log(err)
                res.json(err)
            })
    },
    saveDealer: (req, res) => {
        insertDocument('Template_Builder', 'Dealers', req.body, process.env.TB_MONGO_URI)
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
    getOneVariable: (req, res) => {
        readAllDocuments('Template_Builder', 'Variables', {}, req.query, process.env.TB_MONGO_URI)
        .then(result => {
            console.log(result)
            res.json(result)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
    },
    saveVariable: (req, res) => {
        insertDocument('Template_Builder', 'Variables', req.body, process.env.TB_MONGO_URI)
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
    },
    updateVariable: (req, res) => {
        updateDocumentField('Template_Builder', 'Variables', req.query._id, {}, '', req.body, process.env.TB_MONGO_URI)
        .then(result => {
            console.log(result)
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