const AWS = require('aws-sdk');

module.exports.getDealerID = async (req, res, next) => {
    AWS.config.update({region: process.env.AWS_REGION});
    
    const docClient = new AWS.DynamoDB.DocumentClient();
    const { site_id } = req.params
    const params = {
        Key: {
            SiteId: site_id,
            AccountId: site_id
        }, 
        TableName: process.env.AWS_RESOURCE_TABLE_DEV
    }
    
    try {
        const dealerID = await new Promise((resolve, reject) => {
            docClient.get(params, (err, data) => err ? reject(err) : resolve(data)).promise();
        })
        res.locals.dealerId = dealerID.Item.DealerId
        console.log('DealerID retrieved')
        next()
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}