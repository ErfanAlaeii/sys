const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const connect = require(__basedir + '/functions/connect.js');

const deleteAll = (async (req, next, model) => {
    data = await model.model.deleteMany({})
        .then(async data => {
            response = {
                code: 200,
                status: 'success',
                timestamp: Date.now(),
                length: data.deletedCount,
                data: data,
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

module.exports = deleteAll;