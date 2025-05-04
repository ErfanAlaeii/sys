const addCounterPlugin = require(__basedir + '/models/plugins/addCounter.js');
const addExtraFieldsPlugin = require(__basedir + '/models/plugins/addExtraFields.js');
const saveChangesPlugin = require(__basedir + '/models/plugins/saveChanges.js');
//const saveValsPlugin = require(__basedir + '/models/plugins/saveVals.js');
module.exports = {
    addCounter :addCounterPlugin,
    addExtraFields :addExtraFieldsPlugin,
    saveChanges :saveChangesPlugin ,
    //saveVals :saveValsPlugin
 }