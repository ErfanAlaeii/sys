const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const connect = require(__basedir + '/functions/connect.js');
const prepareQuery = require(__basedir + '/functions/prepare_query.js');

const patchSoftDeleteByQuery = (async (req, res, next,model) => {
    await connect();
    const query = prepareQuery(req.body);
    
    await model.model.updateMany(query,  {"deleted":true,"deletedBy":2} ,{ data: req.body } )
        .then(async data => {
            response = {
                code: 204 ,
                status: 'success',
                timestamp: Date.now(),
                data: data,
    }
        }).catch(async error => {
            response = {
                code: 500 ,
                status: 'error',
                timestamp: Date.now(),
                desc: 'There is a problem with database when we are retrieving data from <tables> table!'
                //error: await errorHandler(error),
            }
        })
    return response
});
module.exports = patchSoftDeleteByQuery;