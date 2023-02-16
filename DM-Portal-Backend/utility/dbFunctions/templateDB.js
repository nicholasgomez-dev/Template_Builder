require('dotenv').config();
const { MongoClient, ObjectID, ObjectId } = require("mongodb");
const flatten = require('flat');
const MongoUri = `mongodb+srv://${process.env.mongo_db_atlas_uname}:${process.env.mongo_db_atlas_pword}@${process.env.mongo_connection_url}/admin?retryWrites=true&w=majority`;

/**
 * 
 * @param {String} db - db name
 * @param {String} collection - collection name
 * @param {String {ObjectID}} docID - Mongo Object ID of template
 * @param {Boolean} includePages - Make get call to pages collection and include in return
 */
module.exports.getTemplate = (db, collection, docID, includePages) => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
        client.connect((error, client) => {
            if (error) reject(error);
            const templates = client.db(db);
            templates.collection(collection).findOne({ _id: new ObjectID(docID) })
                .then(template => {
                    if (includePages) {
                        const pageIDs = template.pages.map(page => {
                            return new ObjectID(page.pageID);
                        });
                        templates.collection('template_pages').find({ '_id': { "$in": pageIDs } }).toArray()
                            .then(pagesData => {
                                const updatedPageData = template.pages.map(page => {
                                    const pageData = pagesData.find((data) => { return data._id.toString() === page.pageID.toString() })
                                    return {
                                        ...page,
                                        pageData
                                    }
                                })
                                template.pages = updatedPageData;
                                resolve(template)
                            })
                            .catch(err => reject(err))
                            .finally(() => client.close())
                    } else {
                        resolve(template)
                        client.close()
                    }

                })
                .catch(err => { reject(err); client.close(); })

        })
    })
}

/**
 * 
 * @param {String} db - db name
 * @param {String} collection - collection name
 * @param {JSON} template - JSON object representing template data
 */
module.exports.createTemplate = function (db, collection, template) {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {

        if (!template) reject('Please provide template data!');
        client.connect((err, client) => {
            if (err) reject(err);

            const templateDB = client.db(db);
            const templateColl = templateDB.collection(collection);
            templateColl.insertOne(template)
                .then(data => resolve(data))
                .catch(err => reject(err))
                .finally(() => client.close())
        })
    })
}



/**
 * Returns an array of document objects containing page descriptions, titles, images if available
 * @param {*} db 
 * @param {*} collection 
 * @param {Array} pageIDs - array of page IDs to get listing descriptions for. 
 */
module.exports.getPageMetaData = (db, collection, pageIDs) => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {

        client.connect((err, client) => {
            if (err) reject(err);
            const _db = client.db(db)
            const _coll = _db.collection(collection);

            const findQuery = pageIDs.map(pageID => new ObjectID(pageID));
            _coll.find({ _id: { $in: findQuery } }).project({ "description": 1, "pageType": 1, "_id": 1, "metadata": 1 }).toArray()
                .then(pages => resolve(pages))
                .catch(err => {
                    reject(err)
                }).finally(() => { client.close() })
        })
    })
}