const mongoose = require("mongoose")
const collection_name = require(__basedir + '/functions/collection_name.js')
const collectionName = collection_name(__filename, 'model')
const allPlugins = require(__basedir + '/models/plugins/plugins.js')

const collectionSchema = new mongoose.Schema({
    id: {
        type: Number,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Table {"name":"<table name>"} name is required!'],
        unique: [true, 'Table name is duplicate!'],
    },
}, {
    collection: collectionName, toJSON: { virtuals: true }, toObject: { virtuals: true }
});

collectionSchema.plugin(allPlugins.addExtraFields);
collectionSchema.plugin(allPlugins.addCounter);
collectionSchema.plugin(allPlugins.saveChanges);
collectionSchema.plugin(require('mongoose-autopopulate'));

collectionSchema.index({ _id: 1, name: 1, id: 1 }, { unique: true });
const collectionModel = mongoose.model(collectionName, collectionSchema);
module.exports = { model: collectionModel, schema: collectionSchema }



