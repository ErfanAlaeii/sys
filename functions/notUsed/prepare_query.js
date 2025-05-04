const mergeDeep = require(__basedir + '/functions/merge_deep.js');
function prepareQuery(queryRaw,appendQuery){
    if(typeof queryRaw == 'object'){
        query = queryRaw
    }else{
        try {
            query = JSON.parse(queryRaw);
        } catch {
            query = {}
        }
    }
    query = mergeDeep(query, appendQuery);
    return query;
}
module.exports = prepareQuery