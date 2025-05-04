
doAll = (async (schema, options) => {
    // Adding  created at and last access
    // date and time to the schema

    schema.pre(['findOneAndUpdate'], async function (next) {
        collectionName = this._collection.collectionName;
        //console.log(collectionName);
        //console.log(doc);
        next();
    });
    schema.post(['findOneAndUpdate'], async function (doc, next) {
        collectionName = this._collection.collectionName;
        console.log(collectionName);
        console.log(doc);


        next();
    });



    /*
    schema.pre(['find', 'findOne'], async function (next, docs) {
        this.start = Date.now();
        next()
    });
    schema.post(['find'], async function (result) {
        newresult = {
            total: result.length,
            waitingTime: (Date.now() - this.start),
            result: result
        };
        //return mongoose.overwriteMiddlewareResult(newresult);
        return result
    })

    schema.post('findOneAndUpdate', async function (doc,next) {
        //console.log('------------->>>>>> save to change table: ');
        const post = require(__basedir + '/functions/post.js');
        const changeModel = require(__basedir + '/models/changes.model.js');
        const tableModel = require(__basedir + '/models/tables.model.js');
        //console.log(doc.id);
        console.log(collectionName);
        const tableIds =  await tableModel.model.find({"name":this.mongooseCollection.collectionName}).select(["id"]).limit(1);
        const tableId = tableIds[0].id
        //console.log(this.mongooseCollection.collectionName);
        //console.log(tableId);

        const docChange = {"row_id":doc.id,"table_id":tableId,"data":doc}
       // console.log(docChange);
        await post(docChange, next, changeModel);

        next();
    });
    schema.post('findOneAndUpdate', function (doc,next) {
        //console.log('------------->>>>>> sample: ');
        next();
    });

    schema.pre(["findOneAndUpdate", "updateMany", "updateOne", "update", "save", "replaceOne"], async function (next) {
        this.options.runValidators = true;
        this.setOptions({ runValidators: true });

        const data = this.getUpdate();
        const collectionName= this.mongooseCollection.collectionName;
        const model = require(__basedir+"/models/"+collectionName+".model.js");
        
        //console.log(data);
        if (data.hidden == true) {
            this.findOneAndUpdate({}, {
                hiddendAt: Date.now(),
            });
        }
        if (data.locked == true) {
            this.findOneAndUpdate({}, {
                lockedAt: Date.now(),
            });
        }
        if (data.deleted == true) {
            this.findOneAndUpdate({}, {
                deletedAt: Date.now(),
            });
        }
        this.findOneAndUpdate({}, {
            modifiedAt: Date.now(),
            $inc: { __v: 1 }
        });

        next()
    });
    schema.pre(['deleteOne', 'deleteMany', 'remove'], function (next) {
        //this.deletedAt = Date.now
        //this.deletedBy = 2
        next()
    });

    //await mongoose.connect(process.env.mongoDB).catch(error => console.log(error));
    //const newCounter = new counter();
*/
});

module.exports = { doAll: doAll}