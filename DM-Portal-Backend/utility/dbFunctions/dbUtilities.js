require('dotenv').config();
const { MongoClient, ObjectID, ObjectId } = require("mongodb");
const flatten = require('flat');
const MongoUri = `mongodb+srv://${process.env.mongo_db_atlas_uname}:${process.env.mongo_db_atlas_pword}@${process.env.mongo_connection_url}/admin?retryWrites=true&w=majority`;

// CRUD here
module.exports.insertDocument = (db, coll, data) => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
        client.connect((err, client) => {
            if (err) reject(err)

            const 
            _db = client.db(db)

            _db.collection(coll).insertOne(data)
                .then(result => resolve(result))
                .catch(err => reject(err))
                .finally(() => client.close())
        })
    })

}


module.exports.upsertDocument = (db, coll, data = {}, query = {}) => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
        client.connect((err, client) => {
            if (err) reject(err)

            const
                _db = client.db(db)
            _db.collection(coll).findOneAndUpdate(query,
                {$set: data},{upsert:true,returnNewDocument:true})
                                .then(result => resolve(result))
                                .catch(err => reject(err))
                                .finally(() => client.close())
        })
    })

}

/**
 * 
 * @param {String} db - DB name
 * @param {String} collection - Collection name
 * @param {Object} projectFields - MongoDB project options object. Ex-{ _id: 1, name: 1, title: 0}
 */
module.exports.readAllDocuments = (db, collection, projectFields = {}, filter = {}) => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
        client.connect((err, client) => {
            if (err) return reject(err)
            const dbConn = client.db(db)

            dbConn.collection(collection).find(filter).project(projectFields).toArray()
                .then(docs => resolve(docs))
                .catch(err => reject(err))
                .finally(() => client.close())
        })
    })
}

/**
 * 
 * @param {String} db - DB name
 * @param {String} collection - Collection name
 * @param {String} ObjID - String representation of Mongo object ID
 * @param {Object} projectFields - MongoDB project options object. Ex-{ _id: 1, name: 1, title: 0}
 * @param {Object} sortFields - MongoDB sort options object. Ex-{ name: 1} to return the first document alphabetically
 */
module.exports.getDocumentByID = (db, collection, objID, projectFields = {}, sortFields = {}) => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
        client.connect((error, client) => {
            if (error) reject(error);
            const templates = client.db(db);
            templates.collection(collection).findOne({ _id: ObjectID(objID) }, { projection: projectFields, sort: sortFields })
                .then(data => { resolve(data) })
                .catch(err => { console.log(err); reject(err) })
                .finally(() => client.close())
        })
    })
}

/**
 * 
 * @param {String} db - DB name
 * @param {String} collection - Collection name
 * @param {String} ObjID - String representation of Mongo object ID
 * @param {String} fieldForUpdate - MongoDB update key, i.e "page.date"
 * @param {String} value - value for insert
 */
module.exports.updateDocumentField = (db, collection, objID, fieldForUpdate, value="") => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
        client.connect((error, client) => {
            if (error) reject(error);
            const _db = client.db(db);
            _db.collection(collection).findOneAndUpdate({_id: ObjectID(objID)}, {
                $set: {
                    [fieldForUpdate]: value
                }
            })
            .then(data => { resolve(data) })
            .catch(err => { console.log(err); reject(err) })
            .finally(() => client.close())

        })
    })
}

module.exports.createNewObjectID = (id) => {
    if(id) {return new ObjectID(id)}
    return new ObjectID()
}

/**
 * Returns boolean indicating if string can be parsed into Object ID
 * @param {String | Array} strIDs - array of strings or a string to check
 */
module.exports.isValidObjectIDCheck = (strIDs) => {
    if (Array.isArray(strIDs)) { return strIDs.every(id => ObjectID.isValid(id)) == true }
    else {
        return ObjectID.isValid(strIDs)
    }
}

module.exports.createPageDataFromTemplateDefaultPage = (templatePageData,userDetails) => {
    const { defaultValues } = templatePageData;
    const creationDate = new Date();
    const formattedPageData = {
        _id: this.createNewObjectID(),
        templatePageID: templatePageData._id.toString(),
        slug: templatePageData.slug,
        pageTitle: templatePageData.pageTitle,
        content: defaultValues,
        createdBy: userDetails,
        dateCreated: creationDate,
        lastEditedBy: userDetails,
        dateEdited: creationDate
    }
    return formattedPageData
}

module.exports.createSiteEditLog = (userObj) => {
    return {
        lastEditedBy: userObj,
        dateEdited: new Date()
    }
}