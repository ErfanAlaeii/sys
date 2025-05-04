
const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const connect = require(__basedir + '/functions/connect.js');
const validators = require(__basedir + '/functions/validators.js');
const tableHelpers = require(__basedir + '/functions/table_helpers.js');
const relations_model = require(__basedir + '/models/relations.model.js');
const dbHelper = require(__basedir + '/functions/db.js');

const post_relations = (async (req, next, model) => {
    await connect();
    params = req.params[0].split('/');
    const rowId = params[0];
    param1 = params[1];//relations
    param2 = params[2];//table
    param3 = params[3];
    var isSpecificTypeRelation = typeof param2 === 'string' && param2 !== ''
    var varModel = require(__basedir + '/models/' + param2 + '.model.js');
    records = req.body;
    if (Array.isArray(records)) {
        var response = [];
        for (const single of records) {
            await varModel.model.create(single)
                .then(async data => {
                    varModelTableId = await tableHelpers.getTableId(varModel.schema.options.collection);
                    modelTableId = await tableHelpers.getTableId(model.schema.options.collection);
                    await relations_model.model.create({ row_id_1: rowId, table_id_1: modelTableId, row_id_2: data.id, table_id_2: varModelTableId })
                        .then(async data => {
                            result = {
                                code: 201,
                                status: 'success',
                                timestamp: Date.now(),
                                data: data,
                            }
                        }).catch(async error => {
                            console.log(error);
                            result = {
                                code: 500,
                                status: 'error',
                                timestamp: Date.now(),
                                desc: 'There is a problem with inserting data to database!',
                                //error: await errorHandler(error),
                            }
                        })
                })
                .catch(async error => {
                    console.log(error)
                    result = {
                        code: 500,
                        status: 'error',
                        timestamp: Date.now(),
                        desc: 'There is a problem with inserting data to database!',
                        //error: await errorHandler(error),
                    }
                });
            response.push(result)
        }
    } else {
        // const db = await new dbHelper();
        //await db.init();
        //this.connection = await db.$connect();
        // console.log(db.connection)
        //db.model = 'changes';
        //console.log(db.model);
        //db.model = 'varModel';
        //console.log(db.model);

        //console.log(db.model)
        //console.log(db.collection)
        //db.model('tables');
        //console.log(db.collection)
        //console.log(db.collection);
        //db.query= records
        //console.log(db.query);
        // db.$addToQuery({a:2});
        // console.log(db.query);

        //console.log(db.exist);
        
        const db = await new dbHelper();
        db.$params(req)
        await db.init();
        db.model = param2;
        collection1 = db.collection
        db.model = model
        collection2 = db.collection
        db.query = records;
        await db.$exist()
        if (await db.$exist() === false) {

        }
        db.model = 'tables';
        await db.$getByCol('name', collection1)
        first = { rowId: db.existDoc.id, tableId: db.getByColDoc.id }
        await db.$getByCol('name', collection2)
        second = { rowId: rowId, tableId: db.getByColDoc.id }
        await db.$addRelation(first, second)


        // await varModel.model.find(records).limit(1)
        //    .then(async recordData => {
        /*
            if (recordData.length > 0) {
                varModelRowId = recordData[0].id
                console.log(varModelRowId);
                varModelTableId = await tableHelpers.getTableId(varModel.schema.options.collection);

                modelTableId = await tableHelpers.getTableId(model.schema.options.collection);

                
                await relations_model.model.create({ row_id_1: rowId, table_id_1: modelTableId, row_id_2: varModelRowId, table_id_2: varModelTableId })
                    .then(async data => {
                        result = {
                            code: 201,
                            status: 'success',
                            timestamp: Date.now(),
                            data: data,
                        }
                    }).catch(async error => {
                        console.log(error);
                        result = {
                            code: 500,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is a problem with inserting data to database!',
                            //error: await errorHandler(error),
                        }
                    })

            } else {
                await varModel.model.create(records)
                    .then(async data => {
                        //console.log(varModel.schema.options.collection);
                        varModelTableId = await tableHelpers.getTableId(varModel.schema.options.collection);
                        modelTableId = await tableHelpers.getTableId(model.schema.options.collection);
                        await relations_model.model.create({ row_id_1: rowId, table_id_1: modelTableId, row_id_2: data.id, table_id_2: varModelTableId })
                            .then(async data => {
                                result = {
                                    code: 201,
                                    status: 'success',
                                    timestamp: Date.now(),
                                    data: data,
                                }
                            }).catch(async error => {
                                console.log(error);
                                result = {
                                    code: 500,
                                    status: 'error',
                                    timestamp: Date.now(),
                                    desc: 'There is a problem with inserting data to database!',
                                    //error: await errorHandler(error),
                                }
                            })
                    }).catch(async error => {
                        console.log(error);
                        result = {
                            code: 500,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is a problem with inserting data to database!',
                            //error: await errorHandler(error),
                        }

                    })
            }*/
        //}).catch(async error => {


        //});
    }
    next();
    return response
});
module.exports = post_relations;