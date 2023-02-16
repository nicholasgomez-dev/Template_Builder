const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});

  const params = {
    FunctionName: 'CreateInventoryAdjustmentDataDev'
  };

  const lambda = new AWS.Lambda();
  lambda.invoke(params, function(err, data){
    console.log(data)
    console.log(err)
  })