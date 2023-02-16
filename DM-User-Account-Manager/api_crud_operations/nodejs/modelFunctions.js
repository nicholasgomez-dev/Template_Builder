const MongoUrl = "mongodb+srv://"+String(process.env.mongo_db_atlas_uname)+":"+String(process.env.mongo_db_atlas_pword)+ "@" + process.env.mongo_connection_url + "/test?retryWrites=true&w=majority"

module.exports = {
  initialize_site: function (sitename, siteemailaddress) {
    return new Promise((resolve, reject) => {
      require('dotenv').config();
      var MongoClient = require('mongodb').MongoClient;
      MongoClient.connect(MongoUrl, function(err, db) {
        if (err) { db.close(); return; }
        var dbo = db.db("aws_user_accounts");
        dbo.collection("sites").insertOne({ "sitename": sitename, "siteemailaddress": siteemailaddress, site_privileges: [] }, function (err, res) {
          if (err) { db.close(); reject(); }
          console.log(res)
          db.close(); resolve(res.insertedId);
        });
      });
    });
  },
  fetch_user_by_hash_id: function(hash_id) { // hash_id referring to mongo assigned record id
    require('dotenv').config();
    var ObjectId = require('mongodb').ObjectID;
    var MongoClient = require('mongodb').MongoClient;
    return new Promise((resolve,reject) => {
      MongoClient.connect(MongoUrl, function(err, db) {
        if (err) { db.close(); reject(err); }
        var dbo = db.db("aws_user_accounts");
        dbo.collection("users").find({_id:new ObjectId(hash_id)}).toArray( function(err, user_record) {
          if (err) { db.close(); reject(err); }
          db.close();
          resolve(user_record);
        });
      });
    });
  },
  fetch_sites: function() {
    require('dotenv').config();
    var MongoClient = require('mongodb').MongoClient;
    return new Promise((resolve, reject) => {
      MongoClient.connect(MongoUrl, function (err, db) {
        if (err) { db.close(); reject(err); }
        var dbo = db.db("aws_user_accounts");
        dbo.collection("sites").find({}).toArray( function(err, site_records) {
          if (err) { db.close(); reject(err); }
          db.close();
          resolve(site_records);
        });
      });
    });
  },
  fetch_sites_by_ids: function (ids) {
    require('dotenv').config();
    var ObjectId = require('mongodb').ObjectID;
    var obj_ids = ids.map(function(ids) { return ObjectId(ids); });
    var MongoClient = require('mongodb').MongoClient;
    return new Promise((resolve, reject) => {
      MongoClient.connect(MongoUrl, function (err, db) {
        if (err) { db.close(); reject(err); }
        var dbo = db.db("aws_user_accounts");
        dbo.collection("sites").find({_id: {$in: obj_ids}}).toArray(function (err, site_records) {
          if (err) { db.close(); reject(err); }
          db.close();
          resolve(site_records);
        });
      });
    });
  },
  toggle_user_activation_status: function(user_hash_id) {
    require('dotenv').config();
    const this_module = require("./modelFunctions.js");
    var ObjectId = require('mongodb').ObjectID;
    var MongoClient = require('mongodb').MongoClient;
    return new Promise((resolve,reject) => {
      this_module.fetch_user_by_hash_id(user_hash_id).then((mongo_records) => {
        if(mongo_records.length < 1) { reject(); }
	      MongoClient.connect(MongoUrl, function(err, db) {
          var dbo = db.db("aws_user_accounts");
          if(!mongo_records[0]["status"]) { db.close(); reject(); }
          if(mongo_records[0]["status"] == "inactive") {
            dbo.collection("users").updateOne({_id:new ObjectId(user_hash_id)},{$set: { "status":"active" }}, function(err) {
              if(err) { db.close(); reject(); } db.close(); resolve();
            });
          } else {
            dbo.collection("users").updateMany({_id:new ObjectId(user_hash_id)},{$set: { "status":"inactive" }}, function(err) {
              if(err) { db.close(); reject(); } db.close(); resolve();
            });
          }
        });
      }).catch((err) => { db.close();reject(); });
    });
  },
  fetch_users: function() {
    require('dotenv').config();
    var MongoClient = require('mongodb').MongoClient;
    return new Promise((resolve,reject) => {
      MongoClient.connect(MongoUrl, function(err, db) {
        if (err) { db.close(); reject(err); }
        var dbo = db.db("aws_user_accounts");
        dbo.collection("users").find({ }).toArray( function(err, user_records) {
          if (err) { db.close(); reject(err); }
          db.close();
          resolve(user_records);
        });
      });
    });
  },
  toggle_user_activation_status: function(user_hash_id) {
    require('dotenv').config();
    const this_module = require("./modelFunctions.js");
    var ObjectId = require('mongodb').ObjectID;
    var MongoClient = require('mongodb').MongoClient;
    return new Promise((resolve,reject) => {
      this_module.fetch_user_by_hash_id(user_hash_id).then((mongo_records) => {
        if(mongo_records.length < 1) { reject(); }
              MongoClient.connect(MongoUrl, function(err, db) {
          var dbo = db.db("aws_user_accounts");
          if(!mongo_records[0]["status"]) { db.close(); reject(); }
          if(mongo_records[0]["status"] == "inactive") {
            dbo.collection("users").updateOne({_id:new ObjectId(user_hash_id)},{$set: { "status":"active" }}, function(err) {
              if(err) { db.close(); reject(); } db.close(); resolve();
            });
          } else {
            dbo.collection("users").updateMany({_id:new ObjectId(user_hash_id)},{$set: { "status":"inactive" }}, function(err) {
              if(err) { db.close(); reject(); } db.close(); resolve();
            });
          }
        });
      }).catch((err) => { db.close();reject(); });
    });
  },
  fetch_collaborator_by_email_address: function (collaborator_email_address) {
    require('dotenv').config();
    var MongoClient = require('mongodb').MongoClient;
    return new Promise((resolve, reject) => {
      MongoClient.connect(MongoUrl, function (err, db) {
        if (err) { db.close(); reject(err); }
        var dbo = db.db("aws_user_accounts");
        dbo.collection("users").find({ "type": "collaborator", "email_address": String(collaborator_email_address) }).toArray(function (err, collaborator_record) {
          if (err) { db.close(); reject(err); }
          db.close();
          resolve(collaborator_record);
        });
      });
    });
  },
  fetch_collaborator_by_hash_id: function(id_hash_string) {
    require('dotenv').config();
    var MongoClient = require('mongodb').MongoClient;
    var ObjectId = require('mongodb').ObjectID;
    return new Promise((resolve, reject) => {
      MongoClient.connect(MongoUrl, function (err, db) {
        if (err) { db.close(); reject(err); }
        var dbo = db.db("aws_user_accounts");
        dbo.collection("users").find({ _id: new ObjectId(id_hash_string) }).toArray(function (err, collaborator_record) {
          if (err) { db.close(); reject(err); }
          db.close();
          resolve(collaborator_record);
        });
      });
    });
  },
  fetch_site_by_hash_id: function (id_hash_string) {
    require('dotenv').config();
    var MongoClient = require('mongodb').MongoClient;
    var ObjectId = require('mongodb').ObjectID;
    return new Promise((resolve, reject) => {
      MongoClient.connect(MongoUrl, function (err, db) {
        if (err) { db.close(); reject(err); }
        var dbo = db.db("aws_user_accounts");
        dbo.collection("sites").find({ _id: new ObjectId(id_hash_string) }).toArray(function (err, site_record) {
          if (err) { db.close(); reject(err); }
          db.close();
          resolve(site_record);
        });
      });
    });
  },
  fetch_omni_by_email_address: function (omni_email_address) {
    require('dotenv').config();
    var MongoClient = require('mongodb').MongoClient;
    return new Promise((resolve, reject) => {
      MongoClient.connect(MongoUrl, function (err, db) {
        if (err) { db.close(); reject(err); }
        var dbo = db.db("aws_user_accounts");
        dbo.collection("users").find({ "type": "omni", "email_address": String(omni_email_address) }).toArray(function (err, omni_record) {
          if (err) { db.close(); reject(err); }
          db.close();
          resolve(omni_record);
        });
      });
    });
  },
  update_user_information_by_user_id: function(user_hash_id,info_dict) {
    require('dotenv').config();

    var parameters_to_update = {};
    var modifiable_parameters = ["first_name","last_name","role"];
    for(var key in info_dict) {
      if(modifiable_parameters.includes(key)) { parameters_to_update[key] = info_dict[key]; }
    }

    var ObjectId = require('mongodb').ObjectID;
    var MongoClient = require('mongodb').MongoClient;
    return new Promise((resolve,reject) => {
      MongoClient.connect(MongoUrl, function(err, db) {
        if (err) { db.close(); reject(err); }
        var dbo = db.db("aws_user_accounts");
        dbo.collection("users").updateOne({_id:new ObjectId(user_hash_id)},{$set: parameters_to_update}, function(err) {
          if(err) { db.close(); reject(); } db.close(); resolve();
        });
      });
    });
  },
  add_collaborator_privileges_to_site_record: function (site_id, collaborator_mongo_id) {
    require('dotenv').config();
    var ObjectId = require('mongodb').ObjectID;
    var MongoClient = require('mongodb').MongoClient;
    thisfile = require('./modelFunctions.js');
    return new Promise((resolve, reject) => {
      thisfile.fetch_site_by_hash_id(site_id).then((site_record) => {
        if (site_record.length < 1) { reject(); }
        var revised_site_privileges = [];
        if (site_record[0]["site_privileges"]) { revised_site_privileges = [...site_record[0]["site_privileges"]]; }
        const duplicate_site_privilege_check = revised_site_privileges.indexOf(collaborator_mongo_id);
        if (duplicate_site_privilege_check !== -1) { reject('User is already privileged to this site') }
        revised_site_privileges.push(collaborator_mongo_id);
        MongoClient.connect(MongoUrl, function (err, db) {
          var dbo = db.db("aws_user_accounts");
          dbo.collection("sites").updateMany({ _id: new ObjectId(site_id) }, { $set: { "site_privileges": revised_site_privileges } }, function (err) {
            if (err) { db.close(); reject(); } db.close(); resolve();
          });
        });
      }).catch((err) => { reject(); });
    });
  },
  remove_collaborator_privilege_from_site_record: function (site_id, collaborator_mongo_id) {
    require('dotenv').config();
    var ObjectId = require('mongodb').ObjectID;
    var MongoClient = require('mongodb').MongoClient;
    thisfile = require('./modelFunctions.js');
    return new Promise((resolve, reject) => {
      thisfile.fetch_site_by_hash_id(site_id).then((site_record) => {
        if (site_record.length < 1) { reject('No sites found for provided id'); }
        var revised_site_privileges = [];
        if (site_record[0]["site_privileges"]) { revised_site_privileges = site_record[0]["site_privileges"]; }
        const collaboratorIndex = revised_site_privileges.indexOf(collaborator_mongo_id);
        if (collaboratorIndex === -1) reject('No collaborator found for provided id');
        revised_site_privileges.splice(collaboratorIndex, 1);
        MongoClient.connect(MongoUrl, function (err, db) {
          var dbo = db.db("aws_user_accounts");
          dbo.collection("sites").updateMany({ _id: new ObjectId(site_id) }, { $set: { "site_privileges": revised_site_privileges } }, function (err) {
            if (err) { db.close(); reject(); } db.close(); resolve();
          });
        });
      }).catch((err) => { reject(); });
    });
  },
  add_site_privilege_to_collaborator_record: function (site_id, collaborator_mongo_id) {
    require('dotenv').config();
    var ObjectId = require('mongodb').ObjectID;
    var MongoClient = require('mongodb').MongoClient;
    thisfile = require('./modelFunctions.js');
    return new Promise((resolve, reject) => {
      thisfile.fetch_collaborator_by_hash_id(collaborator_mongo_id).then((collaborator_user_record) => {
        if (collaborator_user_record.length < 1) { reject('No matching users found'); }
        var revised_site_privileges = [];
        if (collaborator_user_record[0]["site_privileges"]) { revised_site_privileges = collaborator_user_record[0]["site_privileges"]; };
        const duplicate_site_id_check = revised_site_privileges.indexOf(String(site_id));
        if (duplicate_site_id_check !== -1) { reject('Site is already privileged to this user') };
        revised_site_privileges.push(String(site_id));
        MongoClient.connect(MongoUrl, function (err, db) {
          var dbo = db.db("aws_user_accounts");
          dbo.collection("users").updateMany({ _id: new ObjectId(collaborator_mongo_id) }, { $set: { "site_privileges": revised_site_privileges } }, function (err) {
            if (err) { db.close(); reject(); } db.close(); resolve();
          });
        });
      }).catch((err) => { reject(); });
    });
  },
  remove_site_privilege_from_collaborator_record: function (site_id, collaborator_mongo_id) {
    require('dotenv').config();
    var ObjectId = require('mongodb').ObjectID;
    var MongoClient = require('mongodb').MongoClient;
    thisfile = require('./modelFunctions.js');
    return new Promise((resolve, reject) => {
      thisfile.fetch_collaborator_by_hash_id(collaborator_mongo_id).then((collaborator_user_record) => {
        if (collaborator_user_record.length < 1) { reject(); }
        var revised_site_privileges = [];
        if (collaborator_user_record[0]["site_privileges"]) { revised_site_privileges = collaborator_user_record[0]["site_privileges"]; }
        const siteIndex = revised_site_privileges.indexOf(site_id);
        if (siteIndex === -1) reject('No site found for provided id');
        revised_site_privileges.splice(siteIndex, 1);
        MongoClient.connect(MongoUrl, function (err, db) {
          var dbo = db.db("aws_user_accounts");
          dbo.collection("users").updateMany({ _id: new ObjectId(collaborator_mongo_id) }, { $set: { "site_privileges": revised_site_privileges } }, function (err) {
            if (err) { console.log(err); db.close(); reject(); } db.close(); resolve();

          });
        });
      }).catch((err) => { console.log(err); reject(); });
    });
  },
}
