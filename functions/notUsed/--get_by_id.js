const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const connect = require(__basedir + '/functions/connect.js');
const getById = (async (req, next, model) => {
    await connect();
    params = req.params[0].split('/');
    param0 = params[0];
    const id = parseInt(param0);
    const select = req.abilities.view.fields.join(' ');
    await model.model.find({ id: id }).select(select).limit(1)
        .then(async data => {
            response = {
                code: 200,
                status: 'success',
                timestamp: Date.now(),
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
    return response;
});
module.exports = getById;