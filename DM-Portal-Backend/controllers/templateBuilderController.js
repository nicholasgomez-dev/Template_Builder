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
        let newTemplate = req.body;
        newTemplate.created_by = res.locals.dm_user_information.nickname;
        newTemplate.created_at = new Date();
        newTemplate.updated_by = null
        newTemplate.updated_at = null
        insertDocument('Template_Builder', 'Templates', newTemplate, process.env.TB_MONGO_URI)
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
        let updatedDealer = req.body;
        updatedDealer.updated_by = res.locals.dm_user_information.nickname;
        updatedDealer.updated_at = new Date();
        updateDocumentField('Template_Builder', 'Dealers', req.query._id, {}, '', updatedDealer, process.env.TB_MONGO_URI)
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
        let newDealer = req.body;
        newDealer.created_by = res.locals.dm_user_information.nickname;
        newDealer.created_at = new Date();
        newDealer.updated_by = null
        newDealer.updated_at = null
        insertDocument('Template_Builder', 'Dealers', newDealer, process.env.TB_MONGO_URI)
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
        let newVariable = req.body;
        newVariable.created_by = res.locals.dm_user_information.nickname;
        newVariable.created_at = new Date();
        newVariable.updated_by = null
        newVariable.updated_at = null
        insertDocument('Template_Builder', 'Variables', newVariable, process.env.TB_MONGO_URI)
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
    },
    updateVariable: (req, res) => {
        let updatedVariable = req.body;
        updatedVariable.updated_by = res.locals.dm_user_information.nickname;
        updatedVariable.updated_at = new Date();
        updateDocumentField('Template_Builder', 'Variables', req.query._id, {}, '', updatedVariable, process.env.TB_MONGO_URI)
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