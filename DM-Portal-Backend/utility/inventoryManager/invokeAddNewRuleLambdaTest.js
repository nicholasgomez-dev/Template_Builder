  const AWS = require('aws-sdk');
  AWS.config.update({region: 'us-east-2'});

  const sendData = {
    "Rules":{
       "Replace":{
          "VehicleInfo":{
             
          },
          "Pricing":{
             "ExtraPrice1":4444
          }
       }
    },
    "VIN":"10867S104961",
    "DealerID":"126024"
 }

  console.log(sendData)

  const lambdaParams = {
    FunctionName: 'AddInventoryRuleDev',
    Payload: JSON.stringify(sendData)
  }

  const lambda = new AWS.Lambda();
  lambda.invoke(lambdaParams, function(err, data){
    console.log(data)
    console.log(err)
  })