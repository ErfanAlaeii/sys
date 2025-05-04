const mongoose = require("mongoose");
const dotenv = require('dotenv').config();

const collection_name = require(__basedir+'/functions/collection_name.js');
const collectionName = collection_name(__filename,'model');
const addCounterPlugin = require(__basedir+'/models/plugins/addCounter.js');
const addExtraFieldsPlugin = require(__basedir+'/models/plugins/addExtraFields.js');

const collectionSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    table_id: {
        type: Number,
        required: [true, 'Table id is required!'],
    },
    row_id: {
        type: Number,
        required: [true, 'Row Id id is required!'],
    },
    data: {
        type: Object,
        required: [true, 'Data is required!'],
    },
}, {
    collection: collectionName, toJSON: { virtuals: true }, toObject: { virtuals: true }
});
collectionSchema.plugin(addCounterPlugin)
collectionSchema.plugin(addExtraFieldsPlugin)
collectionSchema.index({ _id: 1, id: 1}, { unique: true })
collectionSchema.plugin(require('mongoose-autopopulate'));
const collectionModel = mongoose.model(collectionName, collectionSchema);
module.exports = { model: collectionModel, schema: collectionSchema }



