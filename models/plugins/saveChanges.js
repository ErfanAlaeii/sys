const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const moment = require('moment');
const changes_model = require(__basedir + '/models/changes.model.js');


saveChanges = (async (schema, options) => {
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

                    await db.models.changes.create({table_id: tableData[0].id, row_id:doc.id, data:doc})
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
});
module.exports = saveChanges