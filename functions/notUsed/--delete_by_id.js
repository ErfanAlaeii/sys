const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const connect = require(__basedir + '/functions/connect.js');

const deleteById = (async (req, next, model) => {
    params = req.params[0].split('/');
    const id = parseInt(params[0]);
    data = await model.model.findOneAndDelete({ id: id})
        .then(async data => {
            response = {
                code: 200,
                status: 'success',
                timestamp: Date.now(),
                data: data,
            }
            //deleteChanges
        }).catch(async error => {
            response = {
                code: 500,
                status: 'error',
                timestamp: Date.now(),
                desc: 'There is a problem with database when we are retrieving data!'
                //error: await errorHandler(error),
            }
        })
    next();
    return response;
});
module.exports = deleteById;