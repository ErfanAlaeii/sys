const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const prepareSort = require(__basedir + '/functions/prepare_sort.js');
const pagination = require(__basedir + '/functions/pagination.js');
const connect = require(__basedir + '/functions/connect.js');
const deepGroupBy = require(__basedir + '/functions/deep_group_by.js');


const getAll = (async (req, next, model) => {
    await connect();
    params = req.params[0].split('/');
    param1 = params[1];
    param2 = params[2];
    [limit, skip] = pagination(param1, param2, req.query.limit, req.query.skip);
    //multiple:[["createdAt",-1],["createdBy",-1]] or single:{"createdAt":-1}
    const sort = await prepareSort(req.query.sort);
    const select = req.abilities.view.fields.join(' ');
    await model.model.find({}).select(select).sort(sort).limit(limit).skip(skip)
        .then(async data => {
             data = deepGroupBy(data, req.query.group);            
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
                //error: errorHandler(error),
            }
        })
            
    next();
    return response;
});
module.exports = getAll;