const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const prepareQuery = require(__basedir + '/functions/prepare_query.js');
const connect = require(__basedir + '/functions/connect.js');
const mergeDeep = require(__basedir + '/functions/merge_deep.js');

const deleteSearch = (async (req, next, model, appendQuery = {}) => {
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
            var deletedCount = {success:0,failure:0}
            for(singleDoc of data){
                success = await model.model.findOneAndDelete({ id: singleDoc.id }).then(async singleDocData => {
                    deletedCount.success = deletedCount.success+1
                    //deleteChanges
                }).catch(async singleDocerror => {
                    deletedCount.failure = deletedCount.failure+1
                })
            }
            response = {
                code: 200,
                status: 'success',
                timestamp: Date.now(),
                length: deletedCount.success,
                data: deletedCount
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
module.exports = deleteSearch;