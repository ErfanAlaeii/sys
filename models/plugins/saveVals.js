const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const { AsyncLocalStorage } = require("async_hooks");
const rawValsSchema = new mongoose.Schema({
    id: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    data: {
        type: mongoose.Schema.Types.Json,
        required: true,
    },
}, { collection: "rawVals" });
const rawVals = mongoose.model("rawVals", rawValsSchema);
saveRawVals = (async (schema, options) => {
    schema.pre(['save'], async function (next,asyncLocalStorage) {
        if (typeof doc === 'object') {
            //collectionName = this.collection.name;
            //insertedObj = await counter.findOneAndUpdate({ table_name: collectionName }, { $inc: { sequence_value: 1 } }, { new: true, upsert: true });
        }
        next();
    });
    return schema;
});
module.exports = saveRawVals