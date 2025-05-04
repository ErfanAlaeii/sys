
//console.log('model run');
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();

const collection_name = require(__basedir+'/functions/collection_name.js');
const collectionName = collection_name(__filename,'model');

const addCounterPlugin = require(__basedir+'/models/plugins/addCounter.js');
const addExtraFieldsPlugin = require(__basedir+'/models/plugins/addExtraFields.js');
const saveChangesPlugin = require(__basedir+'/models/plugins/saveChanges.js');

const collectionSchema = new mongoose.Schema({
    id: {
        type: Number,
        index: true
    },
    table_id_1: {
        type: String,
        required: [true, 'table_id_1 is required!'],
    },

    row_id_1: {
        type: String,
        required: [true, 'row_id_1 is required!'],
    },
    table_id_2: {
        type: String,
        required: [true, 'table_id_2 is required!'],
    },

    row_id_2: {
        type: String,
        required: [true, 'row_id_2 is required!'],
    },
}, {
    collection: collectionName, toJSON: { virtuals: true }, toObject: { virtuals: true }
});
collectionSchema.plugin(addExtraFieldsPlugin);
collectionSchema.plugin(addCounterPlugin);
collectionSchema.plugin(saveChangesPlugin);
collectionSchema.index({ table_id_1: 1, row_id_1: 1, table_id_2: 1, row_id_2: 1}, { unique: true });
collectionSchema.plugin(require('mongoose-autopopulate'));
const collectionModel = mongoose.model(collectionName, collectionSchema);
module.exports = { model: collectionModel, schema: collectionSchema }



