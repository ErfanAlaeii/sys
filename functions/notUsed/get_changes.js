const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const prepareSort = require(__basedir + '/functions/prepare_sort.js');
const {isNumeric} = require(__basedir + '/functions/validators.js');

const pagination = require(__basedir + '/functions/pagination.js');
const connect = require(__basedir + '/functions/connect.js');

const changes_model = require(__basedir + '/models/changes.model.js');
const tables_model = require(__basedir + '/models/tables.model.js');

const getChanges = (async (req, next, model) => {
    await connect();
    params = req.params[0].split('/');
    const rowId = params[0];
    param1 = params[1];//always changes - because of this value this script run
    param2 = params[2];//page or numebr revision change geater number means older record
    param3 = params[3];
    if(isNumeric(param2)){
        var limit = 1;
        var skip = parseInt(param2)-1;
    }else{
        [limit, skip] = pagination(param2, param3, req.query.limit, req.query.skip);
    }
    const sort = prepareSort(req.query.sort);
    const select = req.abilities.view.fields.join(' ');
    await tables_model.model.find({ name: model.schema.options.collection }).select('id').limit(1)
        .then(async tableData => {
            await changes_model.model.find({ table_id: tableData[0].id, row_id: rowId }).select(select).sort(sort).limit(limit).skip(skip)
                .then(async data => {
                    response = {
                        code: 200 ,
                        status: 'success',
                        timestamp: Date.now(),
                        length: data.length,
                        data: data,
                    }
                }).catch(async error => {
                    console.log(error)
                    response = {
                        code: 500,
                        status: 'error',
                        timestamp: Date.now(),
                        desc: 'There is a problem with database when we are retrieving data from <changes> table!'
                        //error: await errorHandler(error),
                        
                    }
                })
        }).catch(async error => {
            console.log(error)
            response = {
                code: 500,
                status: 'error',
                timestamp: Date.now(),
                desc: 'There is a problem with database when we are retrieving data from <tables> table!'
                //error: await errorHandler(error),
            }
        })
    return response;
});
module.exports = getChanges;