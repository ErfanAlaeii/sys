const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const pagination = require(__basedir + '/functions/pagination.js');
const prepareSort = require(__basedir + '/functions/prepare_sort.js');
const prepareQuery = require(__basedir + '/functions/prepare_query.js');
const connect = require(__basedir + '/functions/connect.js');

const getUnlockeds = (async (req, res, next, model) => {
    await connect();
    [limit, skip] = pagination(req.params.param2, req.params.param3, req.query.limit, req.query.skip);
    const sort = prepareSort(req.query.sort);
    var query = prepareQuery(req.query.query);
    query.locked = false;
    const select = req.abilities.view.fields.join(' ');

    data = await model.model.find(query).select(select).sort(sort).limit(limit).skip(skip)
        .then(async data => {
            response = {
                code: 200,
                status: 'success',
                timestamp: Date.now(),
                length: data.length,
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

    return response
});
module.exports = getUnlockeds;