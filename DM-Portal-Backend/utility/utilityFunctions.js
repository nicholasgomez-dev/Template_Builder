module.exports = {
/*
* Used to better handle errors in awaited functions 
* @param {Promise} promise
* @returns {Promise} [ data, undefined ]
* @returns {Promise} [ undefined, Error ]
*/
    asyncWrapper: (promise) => {
        return promise
            .then(data => ([data, undefined]))
            .catch(error => Promise.resolve([undefined, error]));
    },
}