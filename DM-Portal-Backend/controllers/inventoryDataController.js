const AWS = require('aws-sdk');
const { invokeLambda } = require('../utility/dbFunctions/AWSUtils');

AWS.config.update({region: process.env.AWS_REGION});
const lambda = new AWS.Lambda();

module.exports.getDealerInventory = async (req, res) => {

    AWS.config.update({region: process.env.AWS_REGION});

    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.AWS_MERGED_TABLE_DEV,
        KeyConditionExpression: 'DealerID = :dealer',
        ExpressionAttributeNames:{
            "#yr": "Year",
            "#tm": "Trim"
        },
        ExpressionAttributeValues: {
            ':dealer': res.locals.dealerId
        },
        ProjectionExpression: 'DealerID, VehicleInfo.StockNumber, VehicleInfo.VehicleStatus, ListOfPhotos , VehicleInfo.#yr, VehicleInfo.Make, VehicleInfo.Model, VehicleInfo.#tm, Pricing.ExtraPrice1, VIN'
    }

    try {
        const inventoryData = await new Promise((resolve, reject) => {
            let retrievedData = []
            
            docClient.query(params, onQuery);
            
            function onQuery(err, data) {
                if (err) {
                    console.log("Unable to query. Error:", JSON.stringify(err.message, null, 2));
                    reject()
                } else {

                    if (typeof data.LastEvaluatedKey != "undefined") {
                        console.log("Looking for more...");
                        params.ExclusiveStartKey = data.LastEvaluatedKey;
                        retrievedData.push(data.Items)

                        docClient.query(params, onQuery);
                    } else {
                        retrievedData.push(data.Items)
                        console.log('Inventory data query complete!')
                        resolve(retrievedData)
                    }
                }
            }
        })

        res.send(inventoryData[0]);
    } catch (err) {
        if (err) {
            console.log(err)
            res.send(err);
        }
    }
}


module.exports.getLandingInventoryItem = async (req, res) => {

    AWS.config.update({region: process.env.AWS_REGION});
    const docClient = new AWS.DynamoDB.DocumentClient();

    const { vehicleVIN } = req.params

    const params = {
        TableName: process.env.AWS_LANDING_TABLE_DEV,
        KeyConditionExpression: 'DealerID = :dealer and VIN = :vin',
        ExpressionAttributeValues: {
            ':dealer':  res.locals.dealerId,
            ':vin': vehicleVIN
        },
        ProjectionExpression: 'DealerID, ListOfPhotos, VehicleInfo, Pricing, VIN'
    }

    try {
        const inventoryData = await new Promise((resolve, reject) => {
            docClient.query(params, (err, data) => err ? reject(err) : resolve(data)).promise();
        })

        console.log('Get item operation successful! Parameters used: ' + JSON.stringify(req.params))
        console.log('Item recieved!')
        res.send(inventoryData.Items[0]);
    } catch {
        console.log(err)
        res.send(err);
    }
}


module.exports.getInventoryItemRules = async (req, res) => {

    AWS.config.update({region: process.env.AWS_REGION});
    const docClient = new AWS.DynamoDB.DocumentClient();

    const { vehicleVIN } = req.params

    const params = {
        TableName: process.env.AWS_RULES_TABLE_DEV,
        KeyConditionExpression: 'DealerID = :dealer and VIN = :vin',
        ExpressionAttributeValues: {
            ':dealer': res.locals.dealerId,
            ':vin': vehicleVIN
        }
    }

    try {
        const rulesData = await new Promise((resolve, reject) => {
            docClient.query(params, (err, data) => err ? reject(err) : resolve(data)).promise();
        })

        console.log('Get item rules operation successful! Parameters used: ' + JSON.stringify(req.params))

        if(!rulesData.Items.length > 0) {
            console.log('No rules found.')
        } else {
            console.log('Rules recieved: ' + JSON.stringify(rulesData))
        }

        res.send(rulesData);
    } catch {
        console.log(err)
        res.send(err);
    }
}

module.exports.putVehicleRules = async (req, res) => {

    AWS.config.update({region: process.env.AWS_REGION});
    const lambda = new AWS.Lambda();
    const reqData = req.body
    const params = {
        FunctionName: process.env.AWS_ADD_RULE_LAMBDA_DEV,
        Payload: JSON.stringify(reqData)
    }

    try {
        const responseData = await new Promise((resolve, reject) => {
            lambda.invoke(params, (err, data) => err ? reject(err) : resolve(data)).promise();
        })

        console.log('Put successful! New data added: ')
        res.send('New rules upload successful.')
    } catch {
        console.log(err)
        res.send(err);
    }
}


module.exports.mergeInventoryChanges = async (req, res) => {
    AWS.config.update({region: process.env.AWS_REGION});
    const lambda = new AWS.Lambda();
    const params = {
        FunctionName: process.env.AWS_MERGE_TABLES_DEV
    }

    try {
        const responseData = await new Promise((resolve, reject) => {
            lambda.invoke(params, (err, data) => err ? reject(err) : resolve(data)).promise();
        })
        res.send(responseData.StatusCode)
    } catch {
        console.log(err)
        res.send(err)
    }

}

module.exports.getInventoryRules = async (req, res) => {
    let dealerIdCheck = req.res.locals.dealerId.replace(/["',]/g, "#");
    let arrayOfCheck = dealerIdCheck.split('#');
    let dm_user_information = req.res.locals.dm_user_information;
    if (dm_user_information.account_type !== 'omni') { return res.status(401).json({ message: 'User does not have access to inventory rules.' }) }

    if(arrayOfCheck.includes(req.body.DealerID)){

        const params = {   
            FunctionName: process.env.AWS_GET_INVENTORY_RULES,
            Payload:JSON.stringify(req.body)
        }

        try {
            const responseData = await lambda.invoke(params).promise().then(data => {
                return data; 
            }).catch(e => {
                console.log('error', e);
                return; 
            });

            // console.log(JSON.parse(responseData.Payload))
            res.send(responseData)
        } catch(err) {
            console.log(err)
            res.send(err)
        }
    }else{
        console.log('DealerID was not found');
        return res.status(401).json({ message: 'DealerID was not found.' });
    }
}

module.exports.removeInventoryRule = async (req, res) => {
    let dealerIdCheck = req.res.locals.dealerId.replace(/["',]/g, "#");
    let arrayOfCheck = dealerIdCheck.split('#');
    let dm_user_information = req.res.locals.dm_user_information;
    if (dm_user_information.account_type !== 'omni') { return res.status(401).json({ message: 'User does not have access to inventory rules.' }) }

    if(arrayOfCheck.includes(req.body.DealerID)){

        const lambda = new AWS.Lambda();
        const params = {
            FunctionName: process.env.AWS_REMOVE_INVENTORY_RULE,
            Payload:JSON.stringify(req.body)
        }

        try {
            const responseData = await lambda.invoke(params).promise().then(data => {
                return data; 
            }).catch(e => {
                console.log('error', e);
                return; 
            });
            res.send(responseData)
        } catch {
            console.log(err)
            res.send(err)
        }
    }else{
        console.log('DealerID was not found');
        return res.status(401).json({ message: 'DealerID was not found.' });
    }
}

module.exports.createInventoryRule = async (req, res) => {
    let dealerIdCheck = req.res.locals.dealerId.replace(/["',]/g, "#");
    let arrayOfCheck = dealerIdCheck.split('#');
    let dm_user_information = req.res.locals.dm_user_information;
    if (dm_user_information.account_type !== 'omni') { return res.status(401).json({ message: 'User does not have access to inventory rules.' }) }
    let dealerIdFromRules = req.body.rulesToSave[0].DealerID;

    if(arrayOfCheck.includes(dealerIdFromRules)){
      
        const params = {
            FunctionName: process.env.AWS_PUT_INVENTORY_RULE,
            Payload:JSON.stringify(req.body.rulesToSave)
        }
        console.log(req.body.rulesToSave)
        try {
            const responseData = await lambda.invoke(params).promise().then(data => {
                return data; 
            }).catch(e => {
                console.log('error', e);
                return; 
            });
            console.log(responseData);
            res.send(responseData);
        } catch {
            console.log(err)
            res.send(err)
        }
    }else{
        console.log('DealerID was not found');
        return res.status(401).json({ message: 'DealerID was not found.' });
    }
}