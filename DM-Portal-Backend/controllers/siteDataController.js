const siteDB = require("../utility/dbFunctions/siteDB");
const dbUtilities = require('../utility/dbFunctions/dbUtilities');
const templateDB = require('../utility/dbFunctions/templateDB');
const mediaDB = require('../utility/dbFunctions/mediaDB');
const crypto = require('crypto');
const AWS = require('aws-sdk');
const { invokeLambda } = require('../utility/dbFunctions/AWSUtils');
const axios = require('axios');
const { asyncWrapper } = require('../utility/utilityFunctions');
const { response } = require("express");
require('dotenv').config();

module.exports.getAllSitesData = (req, res) => {
    dbUtilities.readAllDocuments('template_engine', 'site_data')
        .then(sites => {
            res.json(sites)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

/**
 * 
 * @param {String {ObjectID}} req.params.site_id - Mongodb Object ID of site (not site data)
 * @param {*} res 
 */
module.exports.getSiteDataByID = (req, res) => {

    try {
        const { site_id } = req.params
        const { projectFields = '{}' } = req.query
        const projectObj = JSON.parse(projectFields);
        siteDB.getSiteDataBySiteID('template_engine', 'site_data', site_id, projectObj)
            .then(siteData => {
                if (!siteData) return res.status(404).json({ error: "No site data found for that id" })
                return res.status(200).json(siteData)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }

}
/**
 * 
 * @param {String {ObjectID}} req.params.site_id  Mongodb Object ID of site (not site data)
 * @param {String {ObjectID}} req.params.page_id Mongodb Object ID of site page subdocument/obj 
 * @param {Object} req.body.pageData Contains properties to be updated for page 
 * @param {*} res 
 * @param {*} next 
 */
module.exports.updateSitePageData = async (req, res, next) => {

    try {
        const { site_id, page_id } = req.params
        const { pageData } = req.body;
        const { dm_user_information } = res.locals
        if (!pageData || !site_id || !page_id) return res.status(400).json({ "error": 'Missing paramaters. Please include pageID, siteID, and pageData params.' });
        const checkForValidIDs = dbUtilities.isValidObjectIDCheck([site_id, page_id])
        if (!checkForValidIDs) return res.status(422).json({ "error": "site ID/page ID isn't valid" });

        const [updatedSite, updatedSiteErr] = await asyncWrapper(siteDB.updateSitePageData('template_engine', 'site_data', site_id, page_id, pageData,  dm_user_information ))
        if (updatedSiteErr) throw updatedSiteErr

        //create backup of site_data for versioning
        const backedUpSiteEditObj = {
            site_id,
            site_data: updatedSite.value
        }

        const [backedUpSiteEdit, backedUpSiteErr] = await asyncWrapper(dbUtilities.insertDocument('template_engine', 'site_history', backedUpSiteEditObj))
        if (backedUpSiteErr) throw backedUpSiteErr;

        res.json(updatedSite.value);

    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }

}

/**
 * 
 * @param {String {ObjectID}} req.params.site_id  Mongodb Object ID of site (not site data)
 * @param {String {ObjectID}} req.params.page_id Mongodb Object ID of site page subdocument/obj 
 * @param {Object} req.body.pageData Contains properties to be updated for page 
 * @param {*} res 
 * @param {*} next 
 */

module.exports.updateSiteMetaData = async (req, res, next) => {

    try {
        const { site_id } = req.params;
        const { site_meta_data } = req.body;
        const { dm_user_information } = res.locals

        //CHECK FOR SITE ID AND SITE META DATA
        if (!site_id || !site_meta_data) return res.status(400).json({ "error": 'Missing paramaters. Please include siteID, site meta data and DM user information params.' });
        
        const checkForValidIDs = dbUtilities.isValidObjectIDCheck([site_id]);
        
        //CHECK IF SITE ID MATCHES OBJECT ID IN MONGO
        if (!checkForValidIDs) return res.status(422).json({ "error": "site ID/page ID isn't valid" });

        //GET SITE DATA 
        const [siteData, siteErr] = await asyncWrapper(siteDB.getSiteDataBySiteID('template_engine', 'site_data', site_id)) // gets the appropriate site document by Mongo ObjectID 
        if (siteErr) throw siteErr;

        const siteName = siteData.siteMetadata.siteName; 
        const currentTemplateID = siteData.siteMetadata.currentTemplateID;
        const siteMetadata = {
            siteName,
            site_meta_data,
            currentTemplateID
        }

        //SEND TO UPDATE DB
        const [updatedSite, updatedSiteErr] = await asyncWrapper(siteDB.updateSiteMetaData('template_engine', 'site_data', site_id, site_meta_data,  dm_user_information, siteName, currentTemplateID))
        if (updatedSiteErr) throw updatedSiteErr

        //create backup of site_data for versioning
        const backedUpSiteEditObj = {
            site_id,
            site_data: updatedSite.value
        }

        const [backedUpSiteEdit, backedUpSiteErr] = await asyncWrapper(dbUtilities.insertDocument('template_engine', 'site_history', backedUpSiteEditObj))
        if (backedUpSiteErr) throw backedUpSiteErr;

        res.json(updatedSite.value);

    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }

}

/**
 * 
 * @param {String {ObjectID}} req.params.site_id  Mongodb Object ID of site (not site data)
 * @param {String {ObjectID}} req.params.page_id Mongodb Object ID of site page subdocument/obj 
 * @param {Object} req.body.pageData Contains properties to be updated for page 
 * @param {*} res 
 * @param {*} next 
 */
module.exports.updateSiteSettings = async (req, res, next) => {

    try {
        const { site_id } = req.params
        const { site_settings } = req.body;
        const { dm_user_information } = res.locals
        if (!site_id || !site_settings) return res.status(400).json({ "error": 'Missing paramaters. Please include pageID, siteID, and pageData params.' });
        const checkForValidIDs = dbUtilities.isValidObjectIDCheck([site_id])
        if (!checkForValidIDs) return res.status(422).json({ "error": "site ID/page ID isn't valid" });

        const [updatedSite, updatedSiteErr] = await asyncWrapper(siteDB.updateSiteSettings('template_engine', 'site_data', site_id, site_settings,  dm_user_information ))
        if (updatedSiteErr) throw updatedSiteErr

        //create backup of site_data for versioning
        const backedUpSiteEditObj = {
            site_id,
            site_data: updatedSite.value
        }

        const [backedUpSiteEdit, backedUpSiteErr] = await asyncWrapper(dbUtilities.insertDocument('template_engine', 'site_history', backedUpSiteEditObj))
        if (backedUpSiteErr) throw backedUpSiteErr;

        res.json(updatedSite.value);

    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }

}

module.exports.assignTemplate = async (req, res) => {
    const { site_id } = req.params
    const { template: templateID } = req.body
    const { dm_user_information } = res.locals // user logged in information
    const { user_id, user_email } = dm_user_information
    //this may be made more efficient if the first 3 were in a promise.all
    try {
        const [template, templateErr] = await asyncWrapper(templateDB.getTemplate('template_engine', 'templates', templateID, true))
        if (templateErr) throw templateErr;
        if (!template.isPublic && dm_user_information.account_type !== 'omni') { return res.status(401).json({ message: 'User does not have access to assign admin template.' }) }
        const [userSite, userSiteErr] = await asyncWrapper(dbUtilities.getDocumentByID('aws_user_accounts', 'sites', site_id, { "sitename": 1 }))
        if (userSiteErr) throw userSiteErr;
        const { sitename: siteName } = userSite


        const [siteData, siteErr] = await asyncWrapper(siteDB.getSiteDataBySiteID('template_engine', 'site_data', site_id)) // gets the appropriate site document by Mongo ObjectID 
        if (siteErr) throw siteErr;
        if (!siteData) {
            const pages = template.pages.reduce((arr, page) => {
                if (page.required) arr.push(dbUtilities.createPageDataFromTemplateDefaultPage(page.pageData, dm_user_information))
                return arr
            }, [])

            const siteMetadata = {
                siteName,
                currentTemplateID: template._id.toString()
            }
            const now = new Date()
            const siteDataObj = {
                site_id,
                siteSettings: template.siteSettingsDefaultValues,
                siteNav: template.defaultSiteNav,
                siteMetadata,
                pages,
                createdBy: dm_user_information,
                lastEditedBy: dm_user_information,
                dateEdited: now,
                dateCreated: now,
                published: false
            }
            //add template info to site
            const [updatedSite, updatedSiteErr] = await asyncWrapper(dbUtilities.updateDocumentField('aws_user_accounts', 'sites', site_id, 'templatePageID', template._id.toString()));
            if (updatedSiteErr) throw updatedSiteErr;

            const [newSiteData, newSiteDataErr] = await asyncWrapper(dbUtilities.insertDocument('template_engine', 'site_data', siteDataObj));
            if (newSiteDataErr) throw newSiteDataErr;
            res.json(newSiteData)


        } else {
            siteData.siteMetadata.currentTemplateID !== '' ? res.status(500).json({ message: 'Site already has a template assigned.' }) : updateData(template) // checks to see if there is an assigned template id value at property 'currentTemplateID'
        }

    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }

    // Updates property 'currentTemplateID' with value from req.body.template, only fires if there is no assigned template already
    let updateData = (document) => {
        siteDB.updateSiteData('template_engine', 'site_data', site_id, 'siteMetadata.currentTemplateID', templateID, dm_user_information)
            .then(() => {
                res.status(200)
                res.json({
                    message: 'Template has been successfully assigned',
                    template: document
                })
            })
            .catch(err => {
                console.log(err)

                res.status(500)
                res.json(err)
            })
    }
}

/**
 * Creates a new page object in the pages array for a site
 * @param {String} req.params.site_id - String representation of document obj ID
 * @param {String} req.body.page_id - String representation of document obj ID in template pages collection
 * @param {*} res 
 * @param {*} next 
 */
module.exports.addPageToSite = async (req, res, next) => {
    const { site_id } = req.params;
    const { page_id, slug, pageTitle } = req.body;
    try {
        //verify site exists
        const [site_data, siteErr] = await asyncWrapper(siteDB.getSiteDataBySiteID('template_engine', 'site_data', site_id, { "siteMetadata": 1, "pages": 1 }))
        if (siteErr) throw siteErr;
        if (!site_data) return res.status(404).json({ error: "No sites found matching that ID" });

        //verify that site is in template
        const [template_data, templateErr] = await asyncWrapper(templateDB.getTemplate('template_engine', 'templates', site_data.siteMetadata.currentTemplateID, true));
        if (templateErr) throw templateErr;
        if (!template_data) return res.status(404).json({ error: "No templates found for this site" });

        //get page from template
        const pageForInsert = template_data.pages.filter(page => page.pageID.toString() === page_id.toString())[0].pageData;

        const creationDate = new Date();
        const formattedPageData = {
            _id: dbUtilities.createNewObjectID(),
            templatePageID: pageForInsert._id.toString(),
            slug: slug || pageForInsert.slug,
            pageTitle: pageTitle || pageForInsert.pageTitle,
            content: pageForInsert.defaultValues,
            createdBy: res.locals.dm_user_information,
            lastEditedBy: res.locals.dm_user_information,
            dateEdited: creationDate,
            dateCreated: creationDate
        }
        // push site to subdoc array
        const [updatedSite, updatedSiteErr] = await asyncWrapper(siteDB.pushPageToSiteSubdocumentArray("template_engine", "site_data", site_id, 'pages', formattedPageData, res.locals.dm_user_information));
        if (updatedSiteErr) throw updatedSiteErr;
        const { value } = updatedSite;
        if (!value) return res.status(404).json({ error: "No documents found" });

        //create backup of site_data for versioning
        const backedUpSiteEditObj = {
            site_id,
            site_data: value
        }
        const [backedUpSiteEdit, backedUpSiteErr] = await asyncWrapper(dbUtilities.insertDocument('template_engine', 'site_history', backedUpSiteEditObj))
        if (backedUpSiteErr) throw backedUpSiteErr;

        return res.json({ pageID: formattedPageData._id })


    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }

}

/**
 * Deletes a page object in the pages array for a site
 * @param {String} req.params.site_id - String representation of document obj ID
 * @param {String} req.body.page_id - String representation of page ID
 * @param {*} res 
 * @param {*} next 
 */
module.exports.deletePageFromSite = async (req, res, next) => {
    const { site_id } = req.params;
    const { page_id } = req.body;
    try {
        //verify site exists
        const [site_data, siteErr] = await asyncWrapper(siteDB.getSiteDataBySiteID('template_engine', 'site_data', site_id))
        if (siteErr) throw siteErr;
        if (!site_data) return res.status(404).json({ error: "No sites found matching that ID" });

        //get page from site
        const pageForDelete = site_data.pages.filter(page => page._id.toString() === page_id)[0];
        if (!pageForDelete) return res.status(404).json({ error: "No pages found matching that ID" });
        
        // insert page into deleted_pages collection
        const [deleted, deletedErr] = await asyncWrapper(siteDB.addPageToDeletedPages("template_engine", "deleted_pages", site_id, pageForDelete, res.locals.dm_user_information));
        if (deletedErr) throw deletedErr
        
        // remove site from subdoc array
        const [updatedSite, updatedSiteErr] = await asyncWrapper(siteDB.removePageFromSiteSubdocumentArray("template_engine", "site_data", site_id, pageForDelete, res.locals.dm_user_information));
        if (updatedSiteErr) throw updatedSiteErr;
        const { value } = updatedSite;
        if (!value) return res.status(404).json({ error: "No documents found" });

        //create backup of site_data for versioning
        const backedUpSiteEditObj = {
            site_id,
            site_data: value
        }
        const [backedUpSiteEdit, backedUpSiteErr] = await asyncWrapper(dbUtilities.insertDocument('template_engine', 'site_history', backedUpSiteEditObj))
        if (backedUpSiteErr) throw backedUpSiteErr;

        return res.json({ pageID: pageForDelete._id })


    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }

}


module.exports.getPresignedURL = (req, res) => {
    const s3 = new AWS.S3({
	Bucket: process.env.img_bucket_name,
        signatureVersion: 'v4',
	region: process.env.img_bucket_region
    });
    const imageExtension = 'img/' + req.query.fileExtension; 
    const getSignedUrlforPut = async () => {
    const fileName = crypto.randomBytes(16).toString("hex") + '.' + req.query.fileExtension;
    const params = {
	Bucket: process.env.img_bucket_name,
	Key: fileName,
	ContentType: imageExtension,
	Expires: 60 * 5
    };
	
    try {
       const url = await new Promise((resolve, reject) => {
	 s3.getSignedUrl('putObject', params, (err, url) => {
	   err ? reject(err) : resolve(url);
	 });
       });
       const s3URL = (decodeURI(url) + ' | ' + fileName);
       console.log(s3URL)
       res.send(s3URL)
     } catch (err) {
	if (err) {
	    console.log(err)
	    res.send(err);
	}
       }
     }
     getSignedUrlforPut()    
}

module.exports.storeMetadata = async (req, res) => {
    console.log(req.query);
    const imageDataModel = {
	imageTitle: req.query.imageTitle,
	imageTimestamp: req.query.imageTimestamp,
	imageCdnUrl: req.query.imageCdnUrl,
	siteID: req.query.siteID,
    }
    mediaDB.addImageMetadata('media', 'images', imageDataModel).then((data => { res.json(data) }));
}


module.exports.getSiteImages = async (req, res) => {
    const { site_id } = req.params;    
    dbUtilities.readAllDocuments('media', 'images')
        .then(images => {
	    const siteImages = images.filter(image => image.siteID === site_id);	    
            res.json(siteImages)
	    console.log(siteImages)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })    
}


/**
 * 
 * @param {String} req.params.site_id - String representation of Object ID
 * @param {*} res 
 * @param {*} next 
 */
module.exports.getSiteIncludeExistingPages = async (req, res, next) => {
    const { site_id } = req.params;
    try {
        const [site_data, err] = await asyncWrapper(siteDB.getSiteDataBySiteID('template_engine', 'site_data', site_id));
        if (err) throw err;
        const pageIDs = site_data.pages.map(page => page.templatePageID);

        const [pageDescriptors, pageDescriptorsErr] = await asyncWrapper(templateDB.getPageMetaData('template_engine', 'template_pages', pageIDs))
        if (pageDescriptorsErr) throw pageDescriptorsErr;

        const pagePlusDescriptors = site_data.pages.map(page => {
            const matchingPageDesc = pageDescriptors.find(desc => desc._id.toString() === page.templatePageID.toString())
            return { ...page, description: matchingPageDesc.description || "", pageType: matchingPageDesc.pageType, metadata: matchingPageDesc.metadata }
        })

        const finalSiteData = { ...site_data }
        finalSiteData.pages = pagePlusDescriptors;
        res.json(finalSiteData);

    } catch (e) { res.status(500).json(e) }

}

//This is a bit redundant, will combine with getSiteIncludeExistingPages at some point
/**
 * 
 * @param {String} req.params.site_id - String representation of Object ID
 * @param {*} res 
 * @param {*} next 
 */
module.exports.getSiteDataForGatsbyBuild = async (req, res, next) => {
    const { site_id } = req.params;
    try {
        const [published_site, err] = await asyncWrapper(siteDB.getSiteDataBySiteID('template_engine', 'site_publish', site_id, { "site_data.dateCreated": 0, "site_data.dateEdited": 0, "site_data.createdBy": 0, "site_data.lastEditedBy": 0, "publishedBy": 0, "site_data.pages.dateCreated": 0, "site_data.pages.lastEditedBy": 0, "site_data.pages.dateEdited": 0, "site_data.pages.createdBy": 0 }, { "publishDate": -1 }, "site_id"));
        if (err) throw err;
        const { site_data } = published_site
        const pageIDs = site_data.pages.map(page => page.templatePageID);
        const currentTemplateID = site_data.siteMetadata.currentTemplateID;

        const [templateMetadata, templateMetadataErr] = await asyncWrapper(dbUtilities.getDocumentByID('template_engine', 'templates', currentTemplateID, {"siteSettingsMetadata": 1}))
        if (templateMetadataErr) throw templateMetadataErr;

        const [pageDescriptors, pageDescriptorsErr] = await asyncWrapper(templateDB.getPageMetaData('template_engine', 'template_pages', pageIDs))
        if (pageDescriptorsErr) throw pageDescriptorsErr;

        const pagePlusDescriptors = site_data.pages.map(page => {
            const matchingPageDesc = pageDescriptors.find(desc => desc._id.toString() === page.templatePageID.toString())
            return { ...page, description: matchingPageDesc.description || "", pageType: matchingPageDesc.pageType, metadata: matchingPageDesc.metadata }
        })

        const finalSiteData = { ...site_data }
        finalSiteData.pages = pagePlusDescriptors;
        finalSiteData.siteSettingsMetadata = templateMetadata.siteSettingsMetadata
        res.status(200).json(finalSiteData);

    } catch (e) { console.log(e); res.status(500).json(e) }

}

//This is a bit redundant, will combine with getSiteIncludeExistingPages at some point
/**
 * 
 * @param {String} req.params.site_id - String representation of Object ID
 * @param {*} res 
 * @param {*} next 
 */
module.exports.getSiteDataDirectlyForGatsbyBuild = async (req, res, next) => {
    const { site_id } = req.params;
    try {
        const [site_data, err] = await asyncWrapper(siteDB.getSiteDataBySiteID('template_engine', 'site_data', site_id, { "dateCreated": 0, "dateEdited": 0, "createdBy": 0, "lastEditedBy": 0,  "pages.dateCreated": 0, "pages.lastEditedBy": 0, "pages.dateEdited": 0, "pages.createdBy": 0 }, { "dateEdited": -1 }, "site_id"));
        if (err) throw err;
        const pageIDs = site_data.pages.map(page => page.templatePageID);
        const currentTemplateID = site_data.siteMetadata.currentTemplateID;

        const [templateMetadata, templateMetadataErr] = await asyncWrapper(dbUtilities.getDocumentByID('template_engine', 'templates', currentTemplateID, {"siteSettingsMetadata": 1}))
        if (templateMetadataErr) throw templateMetadataErr;

        const [pageDescriptors, pageDescriptorsErr] = await asyncWrapper(templateDB.getPageMetaData('template_engine', 'template_pages', pageIDs))
        if (pageDescriptorsErr) throw pageDescriptorsErr;

        
        const pagePlusDescriptors = site_data.pages.map(page => {
            const matchingPageDesc = pageDescriptors.find(desc => desc._id.toString() === page.templatePageID.toString())
            return { ...page, description: matchingPageDesc.description || "", pageType: matchingPageDesc.pageType, metadata: matchingPageDesc.metadata }
        })

        const finalSiteData = { ...site_data }
        finalSiteData.pages = pagePlusDescriptors;
        finalSiteData.siteSettingsMetadata = templateMetadata.siteSettingsMetadata
        res.status(200).json(finalSiteData);

    } catch (e) { console.log(e); res.status(500).json(e) }

}
module.exports.initiateSiteBuild = async (req, res, next) => {
    const { site_id } = req.params;
    try {
        //get the template ID for the site
        const [site_data, err] = await asyncWrapper(siteDB.getSiteDataBySiteID('template_engine', 'site_data', site_id, { "id": 0 }));
        if (err) throw err;
        if (!site_data || !site_data.siteMetadata || !site_data.siteMetadata.currentTemplateID) return res.status(400).json({ error: "No template ID saved for site" })
        const { currentTemplateID } = site_data.siteMetadata;

        //get the template src and skeleton files for template
        const [template_data, templateErr] = await asyncWrapper(dbUtilities.getDocumentByID('template_engine', 'templates', currentTemplateID, { "skeletonFile": 1, "templateFile": 1, "_id": 0 }));
        if (templateErr) throw templateErr;

        const currDate = new Date()
        //create backup of site_data
        const publishData = {
            publishedBy: res.locals.dm_user_information,
            publishDate: currDate,
            publish: true,
            site_id,
            site_data
        }

        console.log(publishData)
        const [publishedSite, publishErr] = await asyncWrapper(dbUtilities.upsertDocument('template_engine', 'site_publish', publishData,{"site_id":site_id}))
        if (publishErr) throw publishErr

        const [publishedHistorySite, publishHistoryErr] = await asyncWrapper(dbUtilities.insertDocument('template_engine', 'site_history', publishData))
        if (publishHistoryErr) throw publishHistoryErr;
;

        const storePublishUserAndDateObj = {
            "publishedBy": res.locals.dm_user_information,
            "publishDate": currDate,
            "published": true,
        }
        const [siteWithUpdatedLogs, siteWithUpdatedLogsErr] = await asyncWrapper(siteDB.setMultipleSiteDataProps('template_engine', 'site_data', site_id, storePublishUserAndDateObj))
        if (siteWithUpdatedLogsErr) throw siteWithUpdatedLogsErr;

        const postBody = {
            apiBaseUrl: process.env.backend_api_url,
            siteId: site_id,
            ...template_data
        }

        const [lambdaPublish, lambdaPublishErr] = await asyncWrapper(invokeLambda(process.env.lambdaFunctionName, postBody))

        if (lambdaPublishErr) throw lambdaPublishErr;

        res.status(200).json(lambdaPublish.data)

    } catch (e) {
        console.log('publish err', e)
        res.status(500).json(e)
    }
}

module.exports.initiateMasterSiteBuild = async (req, res, next) => {
    const { site_id } = req.params;
    try {
        //get the template ID for the site
        const [site_data, err] = await asyncWrapper(siteDB.getSiteDataBySiteID('template_engine', 'site_data', site_id, { "id": 0 }));
        if (err) throw err;
        if (!site_data || !site_data.siteMetadata || !site_data.siteMetadata.currentTemplateID) return res.status(400).json({ error: "No template ID saved for site" })
        const { currentTemplateID } = site_data.siteMetadata;

        //get the template src and skeleton files for template
        const [template_data, templateErr] = await asyncWrapper(dbUtilities.getDocumentByID('template_engine', 'templates', currentTemplateID, { "skeletonFile": 1, "templateFile": 1, "_id": 0 }));
        if (templateErr) throw templateErr;

        const currDate = new Date()
        //create backup of site_data
        const publishData = {
            publishedBy: res.locals.dm_user_information,
            publishDate: currDate,
            publish: true,
            site_id,
            site_data
        }

        console.log(publishData)
        const [publishedSite, publishErr] = await asyncWrapper(dbUtilities.upsertDocument('template_engine', 'site_publish', publishData,{"site_id":site_id}))
        if (publishErr) throw publishErr

        const [publishedHistorySite, publishHistoryErr] = await asyncWrapper(dbUtilities.insertDocument('template_engine', 'site_history', publishData))
        if (publishHistoryErr) throw publishHistoryErr;
;

        const storePublishUserAndDateObj = {
            "publishedBy": res.locals.dm_user_information,
            "publishDate": currDate,
            "published": true,
        }
        const [siteWithUpdatedLogs, siteWithUpdatedLogsErr] = await asyncWrapper(siteDB.setMultipleSiteDataProps('template_engine', 'site_data', site_id, storePublishUserAndDateObj))
        if (siteWithUpdatedLogsErr) throw siteWithUpdatedLogsErr;

        // query DDB AWSResources for site_id's of sites whose MasterSiteIds array contains site_id 
        // Create the DynamoDB service object
        AWS.config.update({ region: 'us-east-2' });
        var docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
          TableName: process.env.AWS_RESOURCE_TABLE_DEV,
          FilterExpression: 'contains(MasterSiteIds, :masterSiteId)',
          ExpressionAttributeValues: {
            ':masterSiteId': site_id
          }
        };
        
        var siteIds = [site_id];

        docClient.scan(params, onScan);

        function onScan(err, data) {
          if (err) {
            console.error("Unable to scan. Error:", JSON.stringify(err, null, 2));
          } else {
            data.Items.forEach(item => siteIds.push(item.SiteId));

            // continue scanning if we have more items
            if (typeof data.LastEvaluatedKey != "undefined") {
              console.log("Scanning for more...");
              params.ExclusiveStartKey = data.LastEvaluatedKey;
              docClient.scan(params, onScan);
            } else {
              console.log(siteIds);
            }
          }
        }
        
        for (const id of siteIds) {
          const postBody = {
              apiBaseUrl: process.env.backend_api_url,
              siteId: id,
              ...template_data
          }
          const [lambdaPublish, lambdaPublishErr] = await asyncWrapper(invokeLambda(process.env.lambdaFunctionName, postBody))
          if (lambdaPublishErr) throw lambdaPublishErr;
        }
        
        res.status(200).json(siteIds)

    } catch (e) {
        console.log('publish err', e)
        res.status(500).json(e)
    }
}

module.exports.getPageData = async (req, res, next) => {
    const { site_id, page_id } = req.params;
    try {
        //get the template ID for the site
        const [site_data, err] = await asyncWrapper(siteDB.getSiteDataBySiteID('template_engine', 'site_data', site_id));
        if (err) throw err;
        const { pages } = site_data;
        const sitePageIndex = pages.findIndex(page => page._id.toString() === page_id);
        console.log(sitePageIndex)
        if (sitePageIndex === -1) return res.status(404).json({ error: "No pages found for that ID" })
        const sitePageData = pages.splice(sitePageIndex, 1)[0];
        console.log(sitePageData)
        const [templatePage, templatePageErr] = await asyncWrapper(dbUtilities.getDocumentByID('template_engine', 'template_pages', sitePageData.templatePageID));
        if (templatePageErr) throw templatePageErr;

        const responseData = {
            dealership: site_data.siteMetadata.siteName,
            pageMetadata: templatePage.metadata,
            values: sitePageData.content,
            masterPage: sitePageData.masterPage,
            slug: sitePageData.slug,
            pageTitle: sitePageData.pageTitle,
            otherPages: pages
        }
        console.log(responseData)
        return res.json(responseData)
    } catch (e) {
        console.log(e)
        return res.status(500).json(e)
    }

}

module.exports.getSiteSettings = async (req, res, next) => {
    const { site_id } = req.params;
    const { includePages } = req.query; //returns the pages array for use in siteNav
    try {
        //get the template ID for the site
        const [site_data, err] = await asyncWrapper(siteDB.getSiteDataBySiteID('template_engine', 'site_data', site_id));
        if (err) throw err;
        const {siteNav, siteMetadata, siteSettings, pages}  = site_data;
        const { currentTemplateID, siteName,analyticsUrl, dealers } = siteMetadata;
        const [template, templateErr] = await asyncWrapper(dbUtilities.getDocumentByID('template_engine', 'templates', currentTemplateID));
        if (templateErr) throw templateErr;
        const { siteSettingsMetadata } = template

        const responseData = {
            siteSettings,
            dealership: siteName,
            siteNav,
            siteSettingsMetadata,
            analyticsUrl,
            dealers
        }
        if( includePages ) responseData.pages = pages;

        res.json(responseData)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }

}


/**
 * 
 * @param {String {ObjectID}} req.params.site_id  Mongodb Object ID of site (not site data)
 * @param {String {ObjectID}} req.params.page_id Mongodb Object ID of site page subdocument/obj 
 * @param {Object} req.body.pageData Contains properties to be updated for page 
 * @param {*} res 
 * @param {*} next 
 */
module.exports.updateSiteNav = async (req, res, next) => {

    try {
        const { site_id } = req.params
        const { site_navigation } = req.body;
        const { dm_user_information } = res.locals
        if (!site_id || !site_navigation) return res.status(400).json({ "error": 'Missing paramaters. Please include pageID, siteID, and pageData params.' });
        const checkForValidIDs = dbUtilities.isValidObjectIDCheck([site_id])
        if (!checkForValidIDs) return res.status(422).json({ "error": "site ID/page ID isn't valid" });

        const [updatedSite, updatedSiteErr] = await asyncWrapper(siteDB.updateSiteData('template_engine', 'site_data', site_id, 'siteNav.menu', site_navigation,  dm_user_information ))
        if (updatedSiteErr) throw updatedSiteErr

        //create backup of site_data for versioning
        const backedUpSiteEditObj = {
            site_id,
            site_data: updatedSite.value
        }

        const [backedUpSiteEdit, backedUpSiteErr] = await asyncWrapper(dbUtilities.insertDocument('template_engine', 'site_history', backedUpSiteEditObj))
        if (backedUpSiteErr) throw backedUpSiteErr;

        res.json(updatedSite.value);

    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }

}
//write functions that grabs

