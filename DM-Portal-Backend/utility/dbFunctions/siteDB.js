require('dotenv').config();
const { MongoClient, ObjectID, ObjectId } = require("mongodb");
const flatten = require('flat');
const MongoUri = `mongodb+srv://${process.env.mongo_db_atlas_uname}:${process.env.mongo_db_atlas_pword}@${process.env.mongo_connection_url}/admin?retryWrites=true&w=majority`;
/**
 * 
 * @param {String} db - DB name
 * @param {String} collection - Collection name
 * @param {String} ObjID - String representation of Mongo object ID
 * @param {Object} projectFields - MongoDB project options object. Ex-{ _id: 1, name: 1, title: 0}
 */
module.exports.getSiteDataBySiteID = (db, collection, objID, projectFields = {}, sortFields = {}, selectKey = "site_id") => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
        client.connect((error, client) => {
            if (error) reject(error);
            const _db = client.db(db);
            _db.collection(collection).findOne({ [selectKey]: objID }, { projection: projectFields, sort: sortFields })
                .then(data => { resolve(data) })
                .catch(err => { console.log(err); reject(err) })
                .finally(() => client.close())
        })
    })
}



/**
 * 
 * @param {String} db - db name
 * @param {String} collection - collection name
 * @param {String [ObjectID]} siteID - MongoDB Object ID for site 
 * @param {String [ObjectID]} pageID - MongoDB Object ID for page of site data
 * @param {JSON [Array]} pageData - JSON object representing site data for one page
 * @param {Object} userObj - contains user info for logging
 * e.g 
 * {
 * "slug": "/contact",
        "pageTitle": "Contact Page",
        "content": {
            "contact-1": {
                "value": "Sales"
            },
            "image-1": {
                "value": "https://cdn.pixilart.com/photos/large/a2d9ee19fa02786.png"
            },
        }
    }
 * }
 */
module.exports.updateSitePageData = (db, collection, siteID, pageID, pageData, userObj) => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
        client.connect((err, client) => {
            if (err) reject(err);
            const _db = client.db(db);
            const _coll = _db.collection(collection);

            const flattenedPageData = flatten(pageData, { safe: true }); //flatted obj

            const MongoUpdateObj = Object.keys(flattenedPageData).reduce((acc, key) => { //update object keys to have mongo pages.& prefixed
                return { ...acc, [`pages.$.${key}`]: flattenedPageData[key] };
            }, {})
            const editDate = new Date()
            _coll.findOneAndUpdate({
                site_id: siteID,
                pages: { $elemMatch: { _id: ObjectId(pageID) } }
            }, {
                $set: {'published': false, 'lastEditedBy': userObj, "dateEdited": editDate, 'pages.$.lastEditedBy': userObj, 'pages.$.dateEdited': editDate, ...MongoUpdateObj}

            },
                { returnNewDocument: true }
            ).then(data => resolve(data))
                .catch(err => resolve(err))
                .finally(() => client.close())
        })
    })
}

/**
 * 
 * @param {String} db - db name
 * @param {String} collection - collection name
 * @param {String [ObjectID]} siteID - MongoDB Object ID for site 
 * @param {Object} siteSettings - site settings update object
 * @param {Object} userObj - contains user info for logging
 * e.g 
 
 * {
  '354d056c-6439-4e9e-985a-3c30978cebb4': [
    {
      identifier: '48aaca5a-85c3-4488-8b1e-7663e3db72d2',
      value: [Object]
    },
    {
      identifier: 'ee5d3b9e-4c4b-4236-ad45-99a1ae45cff9',
      value: [Object]
    }
  ],
 * }
 */
module.exports.updateSiteSettings = (db, collection, siteID, siteSettings, userObj) => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
        client.connect((err, client) => {
            if (err) reject(err);
            const _db = client.db(db);
            const _coll = _db.collection(collection);

            const flattenedSiteSettings = flatten(siteSettings, { safe: true }); //flatted obj
            const MongoUpdateObj = Object.keys(flattenedSiteSettings).reduce((acc, key) => { //update object keys to have mongo pages.& prefixed
                return { ...acc, [`siteSettings.${key}`]: flattenedSiteSettings[key] };
            }, {})
            _coll.findOneAndUpdate({
                site_id: siteID,
            }, {
                $set: {'published': false, 'lastEditedBy': userObj, "dateEdited": new Date(), ...MongoUpdateObj}
            },
                { returnNewDocument: true }
            ).then(data => resolve(data))
                .catch(err => resolve(err))
                .finally(() => client.close())
        })
    })
}

/**
 * Dynamically updates the siteMetadata mongo collection 
 * @param {String} db - db name
 * @param {String} collection - collection name
 * @param {String [ObjectID]} siteID - MongoDB Object ID for site 
 * @param {String} site_meta_data - Analytics URL being passed to store in DB in metaData collection
 * @param {String} siteName - Site name related to the siteMetadata being stored
 * @param {String} currentTemplateID -Template ID realated to the siteMetada being stored
 * @param {Object} userObj - contains user info for logging
 */
module.exports.updateSiteMetaData = (db, collection, siteID, site_meta_data, userObj, siteName, currentTemplateID) => {
    
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    return new Promise((resolve, reject) => {
        
        client.connect((err, client) => {
            if (err) reject(err);
            const templateDB = client.db(db);
            const templateColl = templateDB.collection(collection);
    
            templateColl.findOneAndUpdate(
                {
                    site_id: siteID
                },{
                    $set: {
                        siteMetadata: {
                            analyticsUrl : site_meta_data,
                            siteName: siteName,
                            currentTemplateID: currentTemplateID
                        },
                        "lastEditedBy": userObj,
                        "dateEdited": new Date()
                    }
                },{
                    returnOriginal: false
                }
            ).then(data => {
                if(data){
                    console.log('Added Analytics URL');
                }
                resolve(data)}
            )
                .catch(err => reject(err))
                .finally(() => client.close());
        })
    })
}


/**
 * Dynamically updates the site_data mongo collection 
 * @param {String} db - db name
 * @param {String} collection - collection name
 * @param {String [ObjectID]} siteID - MongoDB Object ID for site 
 * @param {String} collPropName - MongoDB Object property name
 * @param {JSON [Array]} siteData - JSON object representing site data
 * @param {Object} userObj - contains user info for logging
 */
module.exports.updateSiteData = (db, collection, siteID, collPropName, siteData, userObj) => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
        client.connect((err) => {
            if (err) reject(err);
            const templateDB = client.db(db);
            const templateColl = templateDB.collection(collection);

            templateColl.findOneAndUpdate({
                site_id: siteID
            }, {
                $set: {
                    [collPropName]: siteData,
                    "lastEditedBy": userObj,
                    "dateEdited": new Date()
                },
            },
                {
                    returnOriginal: false
                }
            ).then(data => resolve(data))
                .catch(err => reject(err))
                .finally(() => client.close())
        })
    })
}
/**
 * Pushes a new page subdoc object into the site_data array and updates the user editor fields
 * @param {String} db - db name
 * @param {String} collection - collection name
 * @param {String [ObjectID]} siteID - MongoDB Object ID for site 
 * @param {String} arrName - name of 
 * @param {Object} payload - page data to be inserted
 * @param {Object} userObj - contains user info for logging
 */
module.exports.pushPageToSiteSubdocumentArray = (db, collection, siteID, arrName, payload, userObj) => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
        if (!payload) reject('No data was provided for update')
        client.connect((err) => {
            if (err) reject(err);
            const _db = client.db(db);
            const _coll = _db.collection(collection);
            _coll.findOneAndUpdate({ site_id: siteID }, { '$set': { 'published': false, 'lastEditedBy': userObj, "dateEdited": new Date() }, '$push': { [arrName]: payload } }, { "returnOriginal": false })
                .then(result => resolve(result))
                .catch(err => reject(err))
                .finally(() => { client.close() })
        })
    })
}

/**
 * Inserts a page subdoc object into the deleted_pages array
 * @param {String} db - db name
 * @param {String} deletedCollection - deleted page collection name
 * @param {String} siteID - MongoDB Object ID for site 
 * @param {Object} page - page data to be inserted
 * @param {Object} userObj - contains user info for logging
 */
 module.exports.addPageToDeletedPages = (
   db,
   deletedCollection,
   siteID,
   page,
   userObj
 ) => {
  return new Promise((resolve, reject) => {
   if (!page) reject("No data was provided for deletion");
   const client = new MongoClient(MongoUri, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   });
   client.connect((err) => {
     if (err) reject(err);
     client
       .db(db)
       .collection(deletedCollection)
       .insertOne({
         Page: page,
         SiteID: siteID,
         PageID: page._id.toString(),
         DeletedBy: userObj,
         DeletedTimeStamp: new Date(),
       })
       .then((result) => resolve(result))
       .catch((err) => reject(err))
       .finally(() => {
         client.close();
       });
   });
  });
};

/**
 * Removes a page subdoc object from the site_data array
 * @param {String} db - db name
 * @param {String} collection - collection name
 * @param {String} siteID - MongoDB Object ID for site 
 * @param {Object} page - page data to be inserted
 * @param {Object} userObj - contains user info for logging
 */
 module.exports.removePageFromSiteSubdocumentArray = (
   db,
   collection,
   siteID,
   page,
   userObj
 ) => {
  return new Promise((resolve, reject) => {
      if (!page) reject("No data was provided for deletion");
      const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      client.connect((err) => {
        if (err) reject(err);
          client
          .db(db)
          .collection(collection)
          .findOneAndUpdate(
              { site_id: siteID },
              { $pull: { pages: { _id: page._id } } },
              { returnOriginal: false }
          )
          .then((result) => resolve(result))
          .catch((err) => reject(err))
          .finally(() => {
              client.close();
          });
      });
    });
};

/**
 * Dynamically updates the site_data mongo collection 
 * @param {String} db - db name
 * @param {String} collection - collection name
 * @param {String [ObjectID]} siteID - MongoDB Object ID for site 
 * @param {JSON [Array]} updatedFieldsObj - JSON object with key value pairs for the prop to update and the new values respectively
 */
module.exports.setMultipleSiteDataProps = (db, collection, siteID, updatedFieldsObj) => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
        client.connect((err) => {
            if (err) reject(err);
            const _db = client.db(db);
            const _coll = _db.collection(collection);

            _coll.findOneAndUpdate({
                site_id: siteID
            }, {
                $set: updatedFieldsObj,
            },
                {
                    returnOriginal: false
                }
            ).then(data => resolve(data.value))
                .catch(err => reject(err))
                .finally(() => client.close())
        })
    })
}


/**
 * 
 * @param {String} db 
 * @param {String} collection 
 * @param {*} siteID 
 * @param {*} userID 
 */
module.exports.checkSiteAccessByUser = (db, collection, siteID, userID) => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
        client.connect((err, client) => {
            if (err) reject(err);
            const _db = client.db(db)
            const _coll = _db.collection(collection);

            _coll.findOne({ _id: new ObjectId(siteID) }, { projection: { _id: 1, site_privileges: 1, sitename: 1 } })
                .then(({ site_privileges }) => {
                    site_privileges.includes(userID) ? resolve(true) : resolve(false)
                })
                .catch(err => {
                    reject(err)
                }).finally(() => { client.close() })
        })
    })
}

/**
 * 
 * @param {String} db - db name
 * @param {String} collection - collection name
 * @param {JSON} siteData - JSON object representing site data
 */
module.exports.createSiteData = (db, collection, siteData) => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {

        if (!siteData) reject('Please provide site data!');
        client.connect((err, client) => {
            if (err) reject(err);

            const templateDB = client.db(db);
            const templateColl = templateDB.collection(collection);
            templateColl.insertOne(siteData)
                .then(data => resolve(data))
                .catch(err => reject(err))
                .finally(() => client.close())
        })
    })
}

