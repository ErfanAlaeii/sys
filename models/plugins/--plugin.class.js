const mongoose = require("mongoose");
const moment = require('moment');
const dotenv = require('dotenv').config();
const changes_model = require(__basedir + '/models/changes.model.js');


class mongoosePlugins {
    constructor() {
        //super();
        return this
    }
    async init(req) {
        await super.init(req)
        //const mongoose = require("mongoose");
        //const dotenv = require('dotenv').config();
        return this
    }
    dump() {
        console.log(Object.getOwnPropertyNames(this))
    }
    async $addCounter(schema, options) {
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
    }


    $addExtraFields(schema, options) {

        schema.add({ id: { type: Number } });

        schema.add({ createdAt: { type: Number, default: moment().valueOf() } });
        schema.add({ createdBy: { type: Number, default: null } });

        schema.add({ modifiedAt: { type: Number, default: null } });
        schema.add({ modifiedBy: { type: Number, default: null } });

        schema.add({ deleted: { type: Boolean, default: false } });
        schema.add({ deletedAt: { type: Number, default: null } });
        schema.add({ deletedBy: { type: Number, default: null } });

        schema.add({ hidden: { type: Boolean, default: false } });
        schema.add({ hiddenAt: { type: Number, default: null } });
        schema.add({ hiddenBy: { type: Number, default: null } });

        schema.add({ locked: { type: Boolean, default: false } });
        schema.add({ lockedAt: { type: Number, default: null } });
        schema.add({ lockedBy: { type: Number, default: null } });
        /*
        schema.add({ marked: { type: Boolean, default: false } });
        schema.add({ markedAt: { type: Number, default: null } });
        schema.add({ markedBy: { type: Number, default: null } });
        */
        return schema;
    }

    async $saveChanges(schema, options) {
 
        schema.pre(['findOneAndUpdate'], async function (next) {
            collectionName = this._collection.collectionName;
            next();
        });
        schema.post(['findOneAndUpdate'], async function (doc, next) {
            collectionName = this._collection.collectionName;
            await mongoose.connect(process.env.mongoDB).then(async db => {
                //console.log(db.models.tables.find({}));     
                await db.models.tables.find({ name: collectionName }).select('id').limit(1)
                    .then(async tableData => {
                        //console.log(tableData);       

                        await db.models.changes.create({ table_id: tableData[0].id, row_id: doc.id, data: doc })
                            .then(async data => {

                            }).catch(async error => {
                                console.log('not possible to save changes');
                                console.log(error);
                            });
                    }).catch(async error => {
                        console.log('not possible to find tables');
                        console.log(error);
                    })
            }).catch(async function (error) {
                console.log("not possible to connect for saving changes");
                console.log(error);
            });
            next();
        });
    }
}



module.exports = mongoosePlugins