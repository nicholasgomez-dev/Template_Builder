const sites = require('express').Router();
const modelFunctions = require("../nodejs/modelFunctions.js");
const AWS = require('aws-sdk')
const buffer = require("buffer");

sites.post('/create', function (req, res) {
  if (!req.body.sitename) { res.status(400).end(JSON.stringify({ body: "site name missing from parameters" })); }
  if (!req.body.siteemailaddress) { res.status(400).end(JSON.stringify({ body: "site email address missing from parameters" })); }
  modelFunctions.initialize_site(req.body.sitename, req.body.siteemailaddress).then((id) => {
    const lambdaParams = {
      FunctionName: process.env.create_site_lambda_function_name,
      Payload: JSON.stringify({"SiteId": id})
    }
    const lambda = new AWS.Lambda({region: process.env.aws_region});
    lambda.invoke(lambdaParams, function(err, data){
      console.log(data)
      console.log(err)
    })
    res.status(200).end(JSON.stringify({ body: "site initialized" }));
  }).catch((err) => {
    res.status(500).end(JSON.stringify({ body: "site initializaton failed" }));
  });
});
sites.post('/fetch-sites', function (req, res) {
  console.log(req.dm_user_information);
  if(req.dm_user_information == undefined || req.dm_user_information["account_type"] == undefined || req.dm_user_information["record_id"] == undefined) {
    res.status(413).json({ body: "insufficient user id or account type" });
  }
  if(req.dm_user_information["account_type"] == "collaborator") {
    modelFunctions.fetch_collaborator_by_hash_id(req.dm_user_information["record_id"]).then((user_record)=>{
      if(user_record[0]["site_privileges"] == undefined) { res.status(413).json({ body: "site privileges not present" }); return; }
      modelFunctions.fetch_sites_by_ids(user_record[0]["site_privileges"]).then((site_records) => {
        res.status(200).end(JSON.stringify(site_records));
      }).catch((err) => {
        res.status(500).end(JSON.stringify({ body: err }));
      });
    }).catch((err)=>{
      res.status(500).end(JSON.stringify({ body: err }));
    });
  } else {
    modelFunctions.fetch_sites().then((site_records) => {
      res.status(200).end(JSON.stringify(site_records));
    }).catch((err) => {
      res.status(500).end(JSON.stringify({ body: err }));
    });
  }
});
sites.post('/:site_id/users', function (req, res) {
  if (!req.params.site_id || !req.body.user_id) { res.status(400).json({ body: "collaborator id or site id parameters missing" }); }
  modelFunctions.add_site_privilege_to_collaborator_record(req.params.site_id, req.body.user_id).then(() => {
    modelFunctions.add_collaborator_privileges_to_site_record(req.params.site_id, req.body.user_id).then((i) => {
      res.status(200).json({ body: "privilege issue success" });
    }).catch(() => {
      res.status(500).json({ body: "unable to add privilege to site record" });
    });
  }).catch((err) => {
    console.log(err)
    res.status(500).json({ body: "unabe to add privilege to user record" });
  });
});
sites.delete('/:site_id/users/:user_id', function (req, res) {
  if (!req.params.site_id || !req.params.user_id) { res.status(400).json({ body: "User id or site id parameters missing" }); }
  modelFunctions.remove_site_privilege_from_collaborator_record(req.params.site_id, req.params.user_id).then(() => {
    modelFunctions.remove_collaborator_privilege_from_site_record(req.params.site_id, req.params.user_id).then((i) => {
      res.status(200).json({ body: "privilege issue success" });
    }).catch((err) => {
      console.log(err)
      res.status(500).json({ body: "unable to remove collaborator site privilege from site record" });
    });
  }).catch((err) => {
    console.log(err)
    res.status(500).json({ body: "Unable to remove site privilege from collaborator record" });
  });
});
module.exports = sites;
