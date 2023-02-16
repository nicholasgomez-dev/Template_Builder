const express = require('express')
const path = require('path');
const moment = require('moment');
const bodyparser = require('body-parser');
const request = require('request');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
const port = 80;
require('dotenv').config()
app.use(bodyparser());
app.listen(port, () => console.log("listening on port "+String(port)));

app.use(cookieParser())

app.use("*", function(req,res,next){
  var origin = req.get('origin');
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  next();
})

app.options('*', function(req, res, next){
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "*");    
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.status(204).send();
})

app.use("/api/*", function(req, res, next) {
    const config = require("./config.js");

    // check if the path is for initial uname/pword authentication
    if(req.originalUrl != "/api/credentials") {

      if (!req.headers.authorization) { res.status(403).end(JSON.stringify({ error: 'no authorization header present' })); }

      var jwt = require("jsonwebtoken");
      var app_secret_key = process.env.app_secret_key;
      var decoded_jwt = jwt.verify(req.headers.authorization.split(" ")[1],app_secret_key);

      if(!decoded_jwt) { res.status(401).end(JSON.stringify({error:"no valid credentials provided"})); }

      console.log(decoded_jwt);

      req.dm_user_information = {};
      req.dm_user_information["account_type"] = decoded_jwt["dm_user_type"];
      req.dm_user_information["record_id"] = decoded_jwt["dm_record_id"];

    }
    next();
});
app.use('/api/sites/*', function(req, res, next) {
    if(req.dm_user_information["account_type"] != "omni" && req.dm_user_information["account_type"] != "collaborator") {
      res.status(403).end(JSON.stringify({body:"omni or collab account type privileges not present"}));
    } else {
      next();
    }
});
app.use('/api/users/*', function(req, res, next) {
    if(req.dm_user_information["account_type"] != "omni") { res.status(403).end(JSON.stringify({body:"omni account type privileges not present"})); }
    next();
});

app.get('/', (req, res, next) => {
  res.status(200).send('Dealer Masters API')
});
// include /auth endpoints
var auth_routes = require("./routes/authRouter.js");
app.use('/auth', auth_routes);

// include /users endpoints
var users_routes = require("./routes/usersRouter.js");
app.use('/api/users', users_routes);

// include /sites endpoints
var sites_routes = require("./routes/sitesRouter.js");
app.use('/api/sites', sites_routes);

app.get('/map', function(req, res) {
    var user_to_site_map = {};
    modelFunctions.fetch_collaborators().then((collaborators)=>{
      for(var i = 0; i < collaborators.length; i++) {
        if(!collaborators[i]["site_privileges"]) { user_to_site_map[collaborators[i]["email_address"]] = {};
        } else {
          user_to_site_map[collaborators[i]["email_address"]] = collaborators[i]["site_privileges"];
        }
      }
      res.status(200).end(JSON.stringify({ body:user_to_site_map }));
    }).catch(()=>{
      res.status(500).end(JSON.stringify({ error: 'no authorization header present' }));
    });
});
// 404 endpoint
app.use('*', function(req, res) {
   res.status(404).send('Page not found');
});




