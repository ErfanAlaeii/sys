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
    name: {
        type: String,
        index: true,
        required: [true, 'field name is required!'],
        unique: [true, 'field name is duplicate!'],
    },
    table_id :{
        type: Number,
        required: [true, 'table_id name is required!'],
        unique: [true, 'table_id name is duplicate!'],
    }
}, {
    collection: collectionName, toJSON: { virtuals: true }, toObject: { virtuals: true }
});
collectionSchema.plugin(addExtraFieldsPlugin);
collectionSchema.plugin(addCounterPlugin);
collectionSchema.plugin(saveChangesPlugin);
//collectionSchema.index({ _id: 1, name: 1, id: 1}, { unique: true });
collectionSchema.plugin(require('mongoose-autopopulate'));
const collectionModel = mongoose.model(collectionName, collectionSchema);
module.exports = { model: collectionModel, schema: collectionSchema }



