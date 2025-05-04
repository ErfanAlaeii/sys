const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const prepareQuery = require(__basedir + '/functions/prepare_query.js');
const connect = require(__basedir + '/functions/connect.js');

const getCount = (async (req, next, model) => {
    await connect();
    const query = prepareQuery(req.query.query);
    data = await model.model.countDocuments(query)
        .then(async data => {
            response = {
                code: 200,
                status: 'success',
                timestamp: Date.now(),
                //length: data.length,
                data: data,
            }
        }).catch(async error => {
            response = {
                code: 500,
                status: 'error',
                timestamp: Date.now(),
                desc: 'There is a problem with database when we are retrieving data!'
                //error: await errorHandler(error),
            }
        });
        next();
    return response
})
module.exports = getCount;