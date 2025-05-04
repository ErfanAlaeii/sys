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
    mobile: {
        type: String,
        trim: true,
        index: { unique: true, sparse: true }
    },
    email: {
        type: mongoose.Schema.Types.Email,
        trim: true,
        index: { unique: true, sparse: true }

    },
    nationalCode: {
        type: String,
        trim: true,
        index: { unique: true, sparse: true }

    },
    otp: {
        type: String,
        required: [true, 'required!'],
        //unique: [true, 'Table name is duplicate!'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: process.env.OTPTIMEOUT
    },
}, {
    collection: collectionName, toJSON: { virtuals: true }, toObject: { virtuals: true }
});
collectionSchema.plugin(allPlugins.addExtraFields);
collectionSchema.plugin(allPlugins.addCounter);
collectionSchema.plugin(allPlugins.saveChanges);
collectionSchema.plugin(require('mongoose-autopopulate'));
collectionSchema.index({ _id: 1, id: 1 }, { unique: true });
const collectionModel = mongoose.model(collectionName, collectionSchema);
module.exports = { model: collectionModel, schema: collectionSchema }



