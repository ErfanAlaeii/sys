const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const prepareQuery = require(__basedir + '/functions/prepare_query.js');
const connect = require(__basedir + '/functions/connect.js');
const mergeDeep = require(__basedir + '/functions/merge_deep.js');

const putSearch = (async (req, next, model, appendQuery = {}) => {
    await connect();
    params = req.params[0].split('/');
    param1 = params[1];
    param2 = params[2];
    /******************* */
    let query = prepareQuery(req.query.query);
    query = mergeDeep(query, appendQuery);
    /******************* */
    data = await model.model.find(query).limit(req.query.limit).skip(req.query.skip)
        .then(async data => {
            var updatedCount = {success:0,failure:0}
            for(singleDoc of data){
                success = await model.model.findOneAndReplace({ id: singleDoc.id },req.body,{new:true,upsert:false}).then(async singleDocData => {
                    updatedCount.success = updatedCount.success+1
                    //console.log(singleDocData);
                    //console.log(singleDoc);
                    //addChanges
                    
                }).catch(async singleDocerror => {
                    updatedCount.failure = updatedCount.failure+1
                })
            }
            response = {
                code: 200,
                status: 'success',
                timestamp: Date.now(),
                length: updatedCount.success,
                data: updatedCount,
            }
        }).catch(async error => {
            response = {
                code: 500,
                status: 'error',
                timestamp: Date.now(),
                desc: 'There is a problem with database when we are retrieving data!',
                //error: await errorHandler(error),
            }
        });
    next();
    return response;
});

module.exports = putSearch;