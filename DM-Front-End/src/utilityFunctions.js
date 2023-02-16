/**
 * returns boolean, true if object is empty
 * @param {Object} obj 
 */
module.exports.isEmpty = (obj) => {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}