const { readAllDocuments, insertDocument, updateDocumentField } = require('../utility/dbFunctions/dbUtilities');
require('dotenv').config();

module.exports = {
    // Template Controllers
    getAllTemplates: (req, res) => {
        console.log(req.query)
        readAllDocuments('Template_Builder', 'Templates', {}, {}, process.env.TB_MONGO_URI)
            .then(result => {
                res.json(result)
            })
            .catch(err => {
                console.log(err)
                res.json(err)
            })
    },
    filterTemplates: (req, res) => {
        Promise.all([
            readAllDocuments('Template_Builder', 'Templates', {}, req.query, process.env.TB_MONGO_URI), 
            readAllDocuments('Template_Builder', 'Templates', {}, {oem:"All OEMs", platform:"All Platforms"}, process.env.TB_MONGO_URI),
            readAllDocuments('Template_Builder', 'Templates', {}, {oem:"All OEMs", platform:req.query.platform}, process.env.TB_MONGO_URI),
            readAllDocuments('Template_Builder', 'Templates', {}, {oem:req.query.oem, platform:"All Platforms"}, process.env.TB_MONGO_URI)
        ])
        .then(result => {
            let filteredTemplates = result[0].concat(result[1], result[2], result[3])
            res.json(filteredTemplates)
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
        let updatedTemplate = req.body;
        updatedTemplate.updated_by = res.locals.dm_user_information.nickname;
        updatedTemplate.updated_at = new Date();
        Promise.all([readAllDocuments('Template_Builder', 'Templates', {}, req.query, process.env.TB_MONGO_URI), readAllDocuments('Template_Builder', 'History', {}, { template_id: req.query._id }, process.env.TB_MONGO_URI)])
            .then(result => {
                let history = result[1][0];
                let template = result[0][0];
                // If no history found
                if (!history) {
                    history = {
                        template_id: req.query._id,
                        history: []
                    }
                    history.history.push(template)
                    // Insert new history
                    Promise.all([insertDocument('Template_Builder', 'History', history, process.env.TB_MONGO_URI), updateDocumentField('Template_Builder', 'Templates', req.query._id, {}, '', updatedTemplate, process.env.TB_MONGO_URI)])
                        .then(result => {
                            res.json(result)
                        })
                        .catch(err => {
                            console.log(err)
                            res.json(err)
                        })
                } else {
                    // If history found
                    history.history.push(template)
                    // Update history
                    Promise.all([updateDocumentField('Template_Builder', 'History', history._id, {}, '', history, process.env.TB_MONGO_URI), updateDocumentField('Template_Builder', 'Templates', req.query._id, {}, '', updatedTemplate, process.env.TB_MONGO_URI)])
                        .then(result => {
                            res.json(result)
                        })
                        .catch(err => {
                            console.log(err)
                            res.json(err)
                        })
                }
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
        newDealer.variables = []
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
    // Settings Controllers
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