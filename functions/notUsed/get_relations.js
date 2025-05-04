console.log('relations', __filename);
const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const prepareSort = require(__basedir + '/functions/prepare_sort.js');
const { isNumeric } = require(__basedir + '/functions/validators.js');

const pagination = require(__basedir + '/functions/pagination.js');
const connect = require(__basedir + '/functions/connect.js');

const relations_model = require(__basedir + '/models/relations.model.js');
const tables_model = require(__basedir + '/models/tables.model.js');
/*

*/
const getRelations = (async (req, next, model) => {
    await connect();
    params = req.params[0].split('/');
    const rowId = params[0];
    param1 = params[1];//relations
    param2 = params[2];//table
    param3 = params[3];
    if (isNumeric(param2)) {
        var limit = 1;
        var skip = parseInt(param2) - 1;
    } else {
        [limit, skip] = pagination(param2, param3, req.query.limit, req.query.skip);
    }
    const sort = prepareSort(req.query.sort);
    const select = req.abilities.view.fields.join(' ');
    //const select = '';
    collectionName = model.schema.options.collection
    //console.log(collectionName);
    //console.log(await getTableId(collectionName));

    await tables_model.model.find({ name: collectionName }).select('id').limit(1)
        .then(async firstTableData => {
            //console.log(tableData[0].id);
            //console.log(rowId);
            var isSpecificTypeRelation = typeof param2 === 'string' && param2 !== ''
            if (isSpecificTypeRelation) {
                // console.log(param2);
                q = await tables_model.model.find({ name: param2 }).select('id').limit(1)
                    .then(async relatedTableData => {
                        //console.log(relatedTableData);
                        relatedTableId = relatedTableData[0].id;
                        //console.log(relatedTableId);

                        var q = {
                            $or: [
                                { $and: [{ table_id_1: firstTableData[0].id }, { row_id_1: rowId }, { table_id_2: relatedTableId }] },
                                { $and: [{ table_id_2: firstTableData[0].id }, { row_id_2: rowId }, { table_id_1: relatedTableId }] }
                            ]
                        }
                        return q
                    }).catch(async error => {
                        console.log(error)
                        response = {
                            code: 500,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is a problem with database when we are retrieving data related table name from <tables> table!'
                            //error: await errorHandler(error),
                        }
                    })
            } else {
                var q = {
                    $or: [
                        { $and: [{ table_id_1: firstTableData[0].id }, { row_id_1: rowId }] },
                        { $and: [{ table_id_2: firstTableData[0].id }, { row_id_2: rowId }] }
                    ]
                }
            }

            //console.log(q.$or[0]);
            await relations_model.model.find(q).select('').sort(sort).limit(limit).skip(skip)
                .then(async fistData => {
                    if (isSpecificTypeRelation) {
                        var finalData = []

                    }else{
                        var finalData = {};

                    }
                    
                    for (let i = 0; i < fistData.length; i++) {
                        var relation = fistData[i]
                        //console.log(relation);
                        if (relation.row_id_1 == rowId && relation.table_id_1 == firstTableData[0].id) {
                            var relationRowId = relation.row_id_2
                            var relationTableId = relation.table_id_2
                        } else {
                            var relationRowId = relation.row_id_1
                            var relationTableId = relation.table_id_1
                        }

                        //console.log(relationTableId, relationRowId);
                        await tables_model.model.find({ id: relationTableId }).select('').limit(1)
                            .then(async relationResultTable => {
                                //console.log(__basedir + '/models/'+relationResultTable[0].name+'.model.js');
                                var varModel = require(__basedir + '/models/' + relationResultTable[0].name + '.model.js');
                                //console.log(varModel);
                                //console.log(relationRowId);









                                await varModel.model.find({ id: relationRowId }).select(select).limit(1)
                                    .then(async relationResultData => {
                                        // console.log(typeof relationResultData[0]);
                                        if (typeof relationResultData[0] === 'object') {
                                            if (isSpecificTypeRelation) {
                                                finalData.push(relationResultData[0]);
                                            } else {
                                                if (Array.isArray(finalData[relationResultTable[0].name]) === false) {
                                                    finalData[relationResultTable[0].name] = [];
                                                }
                                                // console.log(finalData[relationResultTable[0].name]);
                                                finalData[relationResultTable[0].name].push(relationResultData[0]);
                                                //console.log(varModel.options.collection);
                                                //console.log(relationResultTable[0].name);;
                                            }

                                        } else {
                                            console.log('not found relation data');
                                        }
                                    }).catch(async error => {
                                        console.log('error in finding the relationed table data');
                                    });









                            }).catch(async error => {
                                console.log('error in finding the relationed table name');
                            });
                    }
                    //data = deepGroupBy(finalData, req.query.group);

                    response = {
                        code: 200,
                        status: 'success',
                        timestamp: Date.now(),
                        length: finalData.length,
                        data: finalData,
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
module.exports = getRelations;