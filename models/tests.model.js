try {
    var mongoose = require("mongoose")
    mongoose = require(__basedir + "/models/custom.types.js")
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
            required: [true, 'Required!'],
            trim: true,
            unique: [true, 'Duplicate!'],
        },
        avatar: {
            type: mongoose.Schema.Types.URL,
            trim: true,

            //required: [true, 'Required!'],
        },
        email: {
            type: mongoose.Schema.Types.Email,
            trim: true,
            index: { unique: true, sparse: true }

        },

    }, {
        collection: collectionName, toJSON: { virtuals: true }, toObject: { virtuals: true }
    });
    collectionSchema.plugin(allPlugins.addExtraFields);
    collectionSchema.plugin(allPlugins.addCounter);
    collectionSchema.plugin(allPlugins.saveChanges);
    //collectionSchema.plugin(allPlugins.saveVals);
    collectionSchema.plugin(require('mongoose-autopopulate'));
    collectionSchema.index({ _id: 1, id: 1 }, { unique: true });
    const collectionModel = mongoose.model(collectionName, collectionSchema);
    module.exports = { model: collectionModel, schema: collectionSchema }
} catch (e) {
    console.log(e);
}