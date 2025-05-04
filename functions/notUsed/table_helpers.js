const tables_model = require(__basedir + '/models/tables.model.js');

async function getTableId(name) {
    return await tables_model.model.find({ name: name }).select('id').limit(1)
        .then(async tableData => {
            //console.log(tableData);
            if (tableData.length === 1) {
                //console.log(tableData[0].id);

                return tableData[0].id
            } else {
                return false;
            }
        }).catch(async error => {
            //console.log(error);
            return false;
        })

}

async function getTableName(id) {
    return await tables_model.model.find({ id: id }).select('name').limit(1)
        .then(async tableData => {
            if (tableData.length === 1) {
                return tableData[0].name
            } else {
                return false;
            }
        }).catch(async error => {
            //console.log(error);
            return false;
        })

}
module.exports = {getTableName,getTableId};