const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-2'});

// Create the DynamoDB service object
const dynamodb = new AWS.DynamoDB.DocumentClient();

const dbParam = {
    TableName: 'InventoryAdjustmentsDev',
    Item: {
        "Rules":{
           "Replace":{
              "Pricing":{
              }
           }
        },
        "VIN":"1RF43464582046216",
        "DealerID":"13357"
     }
}

dynamodb.put(dbParam, function(err,data) {
    if(err){
    console.log("err",err);
    }
    else{
    console.log("data",data)
    }
    });