const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const pagination = require(__basedir + '/functions/pagination.js');
const prepareSort = require(__basedir + '/functions/prepare_sort.js');
const prepareQuery = require(__basedir + '/functions/prepare_query.js');
const connect = require(__basedir + '/functions/connect.js');
const deepGroupBy = require(__basedir + '/functions/deep_group_by.js');

const getSearch = (async (req, next, model, appendQuery = {}, prependSort = {}) => {
    await connect();
    params = req.params[0].split('/');
    param1 = params[1];
    param2 = params[2];
    var sortRaw = req.query.sort
    var limitRaw = req.query.limit
    var skipRaw = req.query.skip
    var queryRaw = req.query.query
    var selectRaw = req.query.select
//group
    /******************* */
    var limit
    var skip
    [limit, skip] = pagination(param1, param2, limitRaw, skipRaw);
    /******************* */
    sort = prepareSort(sortRaw,prependSort);
    /******************* */
    query = prepareQuery(queryRaw,appendQuery);
    /******************* */
    select = req.abilities.view.fields.join(' ');
    /******************* */
    data = await model.model.find(query).select(select).sort(sort).limit(limit).skip(skip)
        .then(async data => {
            dataLength = data.length
            data = deepGroupBy(data, req.query.group);
            response = {
                code: 200,
                status: 'success',
                timestamp: Date.now(),
                length: dataLength,
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
module.exports = getSearch;