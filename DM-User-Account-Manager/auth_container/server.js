const express = require('express')
const path = require('path');
const moment = require('moment');
const bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');

const app = express()
const port = 84;

app.use(cookieParser());
app.use(bodyparser());
app.listen(port, () => console.log("listening on port "+String(port)));


app.get('/', (req, res, next) => {
  res.status(200).send('Dealer Masters API')
});
// diagnostics indicating if the service is currently online and processing requests
app.get('/diagnostics', function (req, res) {
  res.end(JSON.stringify({ status:"success", information:"" }));
});
// Endpoint used to fetch an access token on each pageload
// The HTTP, server side accessible cookie stores the refresh token used to fetch new access tokens
// Once a new access token has been issued, pass back via HTTP response for the client side to load into memory
app.post('/refresh_credentials', function(req, res) {
  const auth0Api = require("./auth0Api.js");
  const modelFunctions = require("./modelFunctions.js");
  if(req.body.refreshToken == undefined) { res.status(400); res.end(); }
  else{
    auth0Api.execute_authentication_refresh(req.body.refreshToken, function(apiResp) {
      if (apiResp === false){
        res.status(401).send({body:apiResp})
      }else{
        res.status(200).send({ body:apiResp });
      }
    });
  }
});
app.post("/execute_password_reset_via_email", function(req, res) {
  const auth0Api = require("./auth0Api.js");
  if(req.body.user_email_address == undefined) { res.status(412); res.end(); }
  auth0Api.send_reset_pword_to_user(req.body.user_email_address, function(apiResp) {
    if(apiResp) { res.status(200).end(); } else { res.status(500).end(); }
  });
});
app.post("/decode_jwt", function(req, res) {
  const auth0Api = require("./auth0Api.js");
  if(req.body.jwt == undefined) { res.status(400); res.end(); }
  var decoded_jwt = auth0Api.verify_jwt(req.body.jwt);
  if(!decoded_jwt) { res.status(500); res.end(); }
  res.status(200).end(JSON.stringify({ body:decoded_jwt }));
});
app.post("/execute_password_reset_via_email", function(req, res) {
  const auth0Api = require("./auth0Api.js");
  if(req.body.user_email_address == undefined) { res.status(412); res.end(); }
  auth0Api.send_reset_pword_to_user(req.body.user_email_address, function(apiResp) {
    if(apiResp) { res.status(200).end(); } else { res.status(500).end(); }
  });
});
// Authenticate username and password for account information stored in auth0
// Store the refresh token, id token in server side accessible HTTP cookie, and return the access token to the client via HTTP response
app.post('/authenticate', function(req, res) {
  const auth0Api = require("./auth0Api.js");
  const modelFunctions = require("./modelFunctions.js");
  if(req.body.email_address == undefined || req.body.pword == undefined) { res.status(400).end(); }
  req.body.email_address = req.body.email_address.toLowerCase();
  auth0Api.signin(req.body.email_address, req.body.pword, function(authResp) {
    if(authResp == "inactive") { res.status(403).end(); }
    if(!authResp["access_token"]) { res.status(401); res.end(); }
    // only return jwt and refresh token (crud operations sets as ccokie, body = jwt)
    res.status(200).end(JSON.stringify({ body:authResp }));
  });
});

app.post('/create_user', function(req, res) {
  var generator = require('generate-password');
  const modelFunctions = require("./modelFunctions.js");
  const auth0Api = require("./auth0Api.js");
  if(req.body.email_address==undefined || req.body.role==undefined || req.body.username==undefined) {
    res.status(400).end(JSON.stringify({ body:"role, email_address, username parameters missing" }));
  }
  var genpword = generator.generateMultiple(5, {
    length: 12,
    numbers: true,
    symbols: true
  });
  req.body.pword = genpword[0];
  req.body.email_address = req.body.email_address.toLowerCase();
  auth0Api.signup(req.body.email_address, req.body.pword, function(api_resp) {
    if(!api_resp["_id"]) { res.status(400); res.end("signup error, user account may already exist"); return; }
    // record the account type in auth0 appication metadata
    var auth0UserId = "auth0|"+api_resp["_id"];
      // record the user internally
      modelFunctions.addUserRecordToModel(req.body.email_address,req.body.username,req.body.role,api_resp["email_address"],auth0UserId).then((collab_record_id) => {
        // record the internal user's record id in the app metadata of auth0 project
        auth0Api.update_user_account_app_data(auth0UserId,{"dm_account_type":req.body.role,"dm_record_id":collab_record_id}, function(update_resp) {
           // send the user a pword reset email
           auth0Api.send_reset_pword_to_user(req.body.email_address, function() {
            res.status(200).end("user initialized");
          });
        });
      }).catch ((err) => {
        res.status(500).end(JSON.stringify({ body:err }));
      })
  });
});
