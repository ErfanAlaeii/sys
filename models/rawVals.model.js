try {
    var mongoose = require("mongoose")
    mongoose = require(__basedir + "/models/custom.types.js")

    const collection_name = require(__basedir + '/functions/collection_name.js')
    const collectionName = collection_name(__filename, 'model')
    //console.log(collectionName);
    const collectionSchema = new mongoose.Schema({
        saveId: {
            type: String,
            index: true
        },
        form: {
            type: String,
            required: true,
        },
        data: {
            type: mongoose.Schema.Types.Json,
            required: true,
        },

    }, {
        collection: collectionName, toJSON: { virtuals: true }, toObject: { virtuals: true }
    });

    collectionSchema.index({ _id: 1, id: 1 }, { unique: true });

    const collectionModel = mongoose.model(collectionName, collectionSchema);
    module.exports = { model: collectionModel, schema: collectionSchema }
} catch (e) {
    console.log(e);
}
