const MongoUrl = "mongodb+srv://"+String(process.env.mongo_db_atlas_uname)+":"+String(process.env.mongo_db_atlas_pword)+ "@" + process.env.mongo_connection_url + "/test?retryWrites=true&w=majority"
module.exports = {
  
  addUserRecordToModel: function(emailAddress, username, type, parent, auth0_user_id) {
    require('dotenv').config();
    thismodule = require('./modelFunctions.js');
    var MongoClient = require('mongodb').MongoClient;
    return new Promise((resolve,reject) => {
      MongoClient.connect(MongoUrl, function(err, db) {
        if (err) { db.close(); reject(err); }
          var dbo = db.db("aws_user_accounts");
          var user_obj = { "email_address":emailAddress, "name":username, "type":type, "status":"active", "parent":parent, "auth0_user_id":auth0_user_id, "site_privileges":[] };
          dbo.collection("users").insertOne(user_obj, function(err, res) {
            if (err) { db.close(); reject(err); } else { db.close(); resolve(res["ops"][0]["_id"]); }
          });
      });
    });
  },
  fetchUserByAuth0Id: function(auth0_user_id) {
    require('dotenv').config();
    var MongoClient = require('mongodb').MongoClient;
    return new Promise((resolve,reject) => {
      MongoClient.connect(MongoUrl, function(err, db) {
        if (err) reject(err);
        var dbo = db.db("aws_user_accounts");
        dbo.collection("users").findOne({ "auth0_user_id":auth0_user_id }, function(err, user_record) {
          if (err) reject(err);
          if (!user_record) { reject(); }
          resolve(user_record);
          db.close();
        });
      });
    });
  },
}
