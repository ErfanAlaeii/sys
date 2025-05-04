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
    nickName: {
        type: String,
        //required: [true, 'Required!'],
        trim: true,
        default: null
    },
    mobile: {
        type: String,
        required: [true, 'Required!'],
        trim: true,
    },
    avatar: {
        type: mongoose.Schema.Types.URL,
        trim: true,
        default: null
    },
    /*
    session: {
        type: String,
        trim: true,
        index: { unique: true, sparse: true },
        default: null
    },
    */
    fid: {
        type:mongoose.Schema.Types.ObjectId,//mongoose.Schema.Types.EmptyObjectId,
        trim: true,
        default: null,
        ref: 'users',
        autopopulate: true,
    }
    
}, {
    collection: collectionName, toJSON: { virtuals: true }, toObject: { virtuals: true }
});
/*
collectionSchema.virtual('fid_p', {
    ref: collectionSchema,
    localField: 'fid',
    foreignField: 'id',
    justOne: true,
    //match: { name: 'Specific Value' }
});
*/



collectionSchema.plugin(allPlugins.addExtraFields);
collectionSchema.plugin(allPlugins.addCounter);
collectionSchema.plugin(allPlugins.saveChanges);
collectionSchema.plugin(require('mongoose-autopopulate'));

collectionSchema.index({ _id: 1, id: 1 , session: 1 }, { unique: true });
const collectionModel = mongoose.model(collectionName, collectionSchema);
module.exports = { model: collectionModel, schema: collectionSchema }