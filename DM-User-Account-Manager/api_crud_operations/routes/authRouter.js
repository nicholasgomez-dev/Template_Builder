const auth = require('express').Router();
const config = require("../config.js");
const request = require('request');
const { ReplSet } = require('mongodb');
auth.post('/credentials', function (req,res) {
    if(!req.body.email_address || !req.body.pword) {
      res.status(400).end(JSON.stringify({ body:"authentication credentials missing" }));
    }
    request.post({url:process.env.authentication_container_address+'/authenticate', form: req.body }, (err, httpResponse, body) => {
      if (err) {
        res.end(JSON.stringify({ status:err }));
      }
      else if (httpResponse.statusCode === 403){
        res.status(401).send({"error": "account inactive"})
	return;
      }
      else if (httpResponse.statusCode === 401){
        res.status(401).send({"error": "Incorrect Email Address or Password"})
	return;
      }
      else if (httpResponse.statusCode === 200){
        var resjson = JSON.parse(body);
        if(!resjson) {
          res.status(500).end(JSON.stringify({ body:"unable to authenticate" }));
        }
        const options = {
          httpOnly: true,
          secure: process.env.environment == "prod" ? true : false
        }
        res.cookie("refresh_token", resjson.body.refresh_token, options)
        res.status(200).end(JSON.stringify({ body:JSON.parse(body)["body"] }));
      }
      else{
        res.status(500).send({"error": "something went wrong"})
      }

    });
});

auth.post('/logout', (req, res) => {
  try {
    res.clearCookie("refresh_token");
    res.status(200).send("logout successful");
  } catch(e) {
    res.status(500).send('Logout unsuccessful');
  }


});

auth.post('/refresh-tokens', function(req, res) {
  console.log('cookie', req.cookies)
  const config = require("../config.js");
  if (!req.cookies["refresh_token"]){
    res.status(401).send({})
  }
  else{
    request.post({url:process.env.authentication_container_address+'/refresh_credentials', form: {refreshToken: req.cookies['refresh_token'] }}, (err, httpResponse, body) => {
      if (err) { res.status(500).end(JSON.stringify({ body:err })); }
      
      if (httpResponse.statusCode !== 200){
        res.status(401).send({})
      }
      else {
        var resjson = JSON.parse(body);
        const options = {
          httpOnly: true,
          secure: process.env.environment == "prod" ? true : false
        }
        res.cookie("refresh_token", resjson.body.refresh_token, options)
        res.status(200).send(resjson);
      }
    });
  }

});

module.exports = auth;
