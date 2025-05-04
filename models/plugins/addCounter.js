const mongoose = require("mongoose");
const dotenv = require('dotenv').config();

const counterSchema = new mongoose.Schema({
    table_name: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
    },
    sequence_value: {
        type: Number,
        required: true,
    },
}, { collection: "counter" });
const counter = mongoose.model("counter", counterSchema);


addCounter = (async (schema, options) => {

    schema.pre(['save'], async function (next) {
        collectionName = this.collection.name;
        lastId = await counter.findOne({ table_name: collectionName });
        if (lastId == null) {
            lastId = { sequence_value: 0 }
        }
        this.createdBy = 1
        this.id = lastId.sequence_value + 1;
        next();
    });

    schema.post(['save'], async function (doc, next) {
        if (typeof doc === 'object') {
            collectionName = this.collection.name;
            insertedObj = await counter.findOneAndUpdate({ table_name: collectionName }, { $inc: { sequence_value: 1 } }, { new: true, upsert: true });
        }
        next();
    });
    return schema;
});
module.exports = addCounter