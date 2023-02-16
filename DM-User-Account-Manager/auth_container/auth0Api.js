module.exports = {
  execute_authentication_refresh: function(refreshToken, callback) {
    const auth0 = require("auth0");
    const this_module = require("./auth0Api.js");
    require('dotenv').config()
    // establish auth0 connection
    var auth = new auth0.AuthenticationClient({
      clientId:String(process.env.auth0ClientId),
      clientSecret:String(process.env.auth0ClientSecret),
      domain:String(process.env.auth0Domain)
    });
    var data = {
      refresh_token: String(refreshToken),
    };
    auth.oauth.refreshToken(data, function (err, userData) {
      if (err) { callback(false); return;  }
      var jwt_payload = this_module.decode_default_jwt(userData["id_token"]);
      var uid = jwt_payload["sub"];
      this_module.fetch_user_details(uid, function(user_details) {
        jwt_payload["dm_user_type"] = String(user_details["app_metadata"]["dm_account_type"]);
        console.log(jwt_payload);
        console.log(user_details);
        if(user_details["app_metadata"]["dm_record_id"]) { jwt_payload["dm_record_id"] = String(user_details["app_metadata"]["dm_record_id"]); }
        userData['id_token'] = this_module.sign_jwt(jwt_payload);
        callback(userData);
      });
    });
  },
  // authenticate a user with their username (email) and password
  signin: function(emailParam, pwordParam, callback) {
    require('dotenv').config()
    const this_module = require("./auth0Api.js");
    const model_functions = require("./modelFunctions.js");
    const auth0 = require("auth0");
    // establish auth0 connection
    var auth = new auth0.AuthenticationClient({
      clientId:String(process.env.auth0ClientId),
      clientSecret:String(process.env.auth0ClientSecret),
      domain:String(process.env.auth0Domain)
    });
    // data to send to auth0 server
    var data = {
      username: String(emailParam),
      password: String(pwordParam),
      scope: 'openid offline_access',
      realm: 'Username-Password-Authentication'
    };
    // execute call to auth0 server to authenticate user with pword
    auth.oauth.passwordGrant(data, function (err, userData) {
      if (err || !userData["id_token"]) { callback(err); return; }
      var jwt_payload = this_module.decode_default_jwt(userData["id_token"]);
      var uid = jwt_payload["sub"];
      this_module.fetch_user_details(uid, function(user_details) {
        console.log(user_details);
        model_functions.fetchUserByAuth0Id(user_details["user_id"]).then((user_record) => {
	  if(user_record["status"] != "active") { callback("inactive"); }
          jwt_payload["dm_user_type"] = String(user_details["app_metadata"]["dm_account_type"]);
         if(user_details["app_metadata"]["dm_record_id"]) { jwt_payload["dm_record_id"] = String(user_details["app_metadata"]["dm_record_id"]); }
          userData["id_token"] = this_module.sign_jwt(jwt_payload);
          callback(userData);
        });
      });
    });
  },
  // create a user with an email, uname and pword (the pword may be updated later)
  signup: function(emailParam, pwordParam, callback) {
    require('dotenv').config()
    const auth0 = require("auth0");
    // establish auth0 connection
    var auth = new auth0.AuthenticationClient({
      clientId:String(process.env.auth0ClientId),
      clientSecret:String(process.env.auth0ClientSecret),
      domain:String(process.env.auth0Domain)
    });
    // data to send to auth0 server
    var data = {
      clientId: 'lmo9vMu1ba6tcWg95dUqPlYIvQoBv4Vr',
      email: String(emailParam),
      password: String(pwordParam),
      connection: 'Username-Password-Authentication'
    };
    // send signup request to auth0 server
    auth.database.signUp(data, function (err, userData) {
      if (err) { callback(err); return; }
      callback(userData);
    });
  }, // end auth0 signup function

  // specify the user type (omni or collaborator) and save it to the auth0 system application records detailing the user coorespoding with the input 
  // id (auth0 assigned uuid most easily accessible via ID token user details payload)

  update_user_account_app_data: function(user_id_input,dict,callback) {
    require('dotenv').config()
    const auth0 = require("auth0");
    var ManagementClient = require('auth0').ManagementClient;
    var management = new ManagementClient({
      clientId:String(process.env.auth0ClientId),
      clientSecret:String(process.env.auth0ClientSecret),
      domain:String(process.env.auth0Domain),
      grantId:String(process.env.auth0GrantId),
      // audience = the id of an API created with auth0 interface, which is privileged to pull resources from the main DM auth0 P
      audience:String(process.env.auth0PrimaryAudience),
      grant_type: "client_credentials",
      scope: "read:users update:users",
    });
    var params = { id: user_id_input };
    var metadata = { };
    for(var value_key in dict) {
      metadata[value_key] = dict[value_key];
    }
    management.updateAppMetadata(params, metadata, function (err, user) {
      if (err) { callback(err); return; }
      callback(user);
    });
  },
  send_reset_pword_to_user: function(email_input,callback) {
    const request = require('request');
    var post_parameters = {};
    post_parameters["client_id"] = String(process.env.auth0ClientId),
    post_parameters["email"] = email_input;
    post_parameters["connection"] = "Username-Password-Authentication";
    request.post( 'https://'+String(process.env.auth0Domain)+'/dbconnections/change_password', { json: post_parameters }, (error, res, body) => {
      if (error) { callback(false); return; }
      callback(true);
    });
  },
  // return full auth0 record of the user, including app metadata
  fetch_user_details: function(user_id_input,callback) {
    require('dotenv').config();
    const auth0 = require("auth0");
    var ManagementClient = require('auth0').ManagementClient;
    var management = new ManagementClient({
      clientId:String(process.env.auth0ClientId),
      clientSecret:String(process.env.auth0ClientSecret),
      domain:String(process.env.auth0Domain),
      // audience = the id of an API created with auth0 interface, which is privileged to pull resources from the main DM auth0 P
      audience:String(process.env.auth0PrimaryAudience),
      grant_type: "client_credentials",
      scope: "read:users update:users",
    });
    var params = { id: user_id_input };
    management.getUser(params, function (err, user) {
      if (err) { callback(err); return; }
      callback(user);
    });
  },
  // the most ommon JWT this function will operate on is the id_token (stored client side)
  decode_default_jwt: function(jwt_str) {
    var jwt = require("jsonwebtoken");
    var decoded_jwt = jwt.decode(jwt_str);
    return decoded_jwt;
  },
  sign_jwt: function(jwt_payload) {
    require('dotenv').config();
    var jwt = require("jsonwebtoken");
    var app_secret_key = process.env.auth0ClientSecret;
    var encoded_jwt = jwt.sign(jwt_payload,app_secret_key);
    return encoded_jwt;
  },
  verify_jwt: function(jwt_payload) {
    var jwt = require("jsonwebtoken");
    var app_secret_key = process.env.auth0ClientId;
    var decoded_jwt = jwt.verify(jwt_payload,app_secret_key);
    return decoded_jwt;
  },
};
