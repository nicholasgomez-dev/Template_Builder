require('dotenv').config();
const { MongoClient, ObjectID, ObjectId } = require("mongodb");
const flatten = require('flat');
const MongoUri = `mongodb+srv://${process.env.mongo_db_atlas_uname}:${process.env.mongo_db_atlas_pword}@${process.env.mongo_connection_url}/admin?retryWrites=true&w=majority`;


/**
 * 
 * @param {String} db - db name
 * @param {String} collection - collection name
 * @param {JSON} imageData - JSON object representing image data
 */
module.exports.addImageMetadata = (db, collection, imageData) => {
    const client = new MongoClient(MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {

        if (!imageData) reject('Image metadata missing!');
        client.connect((err, client) => {
            if (err) reject(err);

            const mediaDB = client.db(db);
            const imageColl = mediaDB.collection(collection);
            imageColl.insertOne(imageData)
                .then(data => resolve(data))
                .catch(err => reject(err))
                .finally(() => client.close())
        })
    })
}

