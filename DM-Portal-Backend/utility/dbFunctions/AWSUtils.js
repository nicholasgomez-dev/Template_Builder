const AWS = require('aws-sdk');

/**
 * 
 * @param {String} functionName 
 * @param {Object|Object[]} payload 
 */
module.exports.invokeLambda = (functionName, payload) => {

  AWS.config.update({
    region: process.env.awsRegion,
  });

  const params = {
    FunctionName: functionName, 
    Payload: JSON.stringify(payload),
  };

  const result = new AWS.Lambda().invoke(params).promise();
  return result;
};
