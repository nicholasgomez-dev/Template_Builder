const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-2'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: 'AdjustedInventoryDev',
    KeyConditionExpression: 'DealerID = :dealer',
    ExpressionAttributeValues: {
        ':dealer': '126024'
    },
    Limit: 1
}

docClient.query(params, onQuery);

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