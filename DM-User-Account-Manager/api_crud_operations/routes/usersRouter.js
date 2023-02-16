const users = require('express').Router();
const config = require("../config.js");
const modelFunctions = require("../nodejs/modelFunctions.js");
const request = require("request");
users.post('/initialize-user', function (req, res) {
    const request = require("request");
    request.post({ url:config.containers_microservice_ip_address+'/create_user', form: req.body }, (err, httpResponse, body) => {
      if (err) { res.status(500).end(JSON.stringify({ body:err })); }
      res.status(200).end(JSON.stringify({ body:body }));
    });
});
users.post('/fetch-users', function (req, res) {
  modelFunctions.fetch_users().then((user_records)=>{
    res.status(200).end(JSON.stringify({ body:user_records }));
  }).catch(()=>{
    res.status(500).end(JSON.stringify({ body:"unable to fetch collaborator records" }));
  });
});

users.post('/:uid/toggle_activation', function (req, res) {
    if (!req.params.uid) {
        res.status(413).end(JSON.stringify({body: ""}));
    }
    console.log(req.params.uid);
    modelFunctions.toggle_user_activation_status(req.params.uid).then((user_records) => {
        res.status(200).end(JSON.stringify({body: user_records}));
    }).catch(() => {
        res.status(500).end(JSON.stringify({body: "unable to fetch collaborator records"}));
    });
});

users.get('/:uid', function(req, res) {
  if(!req.params.uid) { res.status(413).end(JSON.stringify({ body:"" })); }
  modelFunctions.fetch_user_by_hash_id(req.params.uid).then((user_record)=>{
    if(user_record[0]["site_privileges"] == undefined) { res.status(413).json({ body: "site privileges not present" }); return; }
    modelFunctions.fetch_sites_by_ids(user_record[0]["site_privileges"]).then((site_records) => {
      user_record[0]["site_privileges"] = site_records;
      res.status(200).end(JSON.stringify(user_record[0]));
    }).catch((err) => {
      res.status(500).end(JSON.stringify({ body: err }));
    });
  }).catch((err)=>{
    res.status(500).end(JSON.stringify({ body: err }));

  });
});

users.put('/:uid', function(req, res) {
  if(!req.params.uid) { res.status(413).end(JSON.stringify({ body:"" })); }
  modelFunctions.update_user_information_by_user_id(req.params.uid,req.body).then(()=>{
    res.status(200).end();
  }).catch(()=>{
    res.status(500).end();
  });
});
users.post("/initialize_password_reset_email", function (req, res) {
  if(req.body.user_hash_id == undefined) { res.status(412).end(); }
  modelFunctions.fetch_user_by_hash_id(req.body.user_hash_id).then((ur)=>{
    request.post({ url:config.containers_microservice_ip_address+'/execute_password_reset_via_email', form: {"user_email_address":ur[0]["email_address"]} }, (err, httpResponse, body) => {
      if (err) { res.status(500).end(JSON.stringify({ body:err })); }
      res.status(200).end(JSON.stringify({ body:body }));
    });
    res.status(200);
  }).catch(()=>{
    res.status(500);
  })
});
module.exports = users;
