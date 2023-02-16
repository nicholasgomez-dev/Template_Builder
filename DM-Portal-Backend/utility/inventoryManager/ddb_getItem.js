const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-2'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
    Key: {
        SiteId: '60b128e17eac6c13ef12b6c7',
        AccountId: '60b128e17eac6c13ef12b6c7'
       }, 
       TableName: 'AWSResourcesDev'
      };
   docClient.get(params, onQuery);

   function onQuery(err, data) {
       if (err) {
           console.log("Unable to query. Error:", JSON.stringify(err.message, null, 2));
       } else {
           console.log(JSON.stringify(data));
   
           //LOOP
           // if (typeof data.LastEvaluatedKey != "undefined") {
           //     console.log("Looking for more...");
           //     params.ExclusiveStartKey = data.LastEvaluatedKey;
           //     docClient.query(params, onQuery);
           // } else {
           //     return console.log('Query complete!')
           // }
       }
   }