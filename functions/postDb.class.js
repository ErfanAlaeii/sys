const getDb = require(__basedir + '/functions/getDb.class.js');
class postDb extends getDb {
    constructor() {
        super();
        return this
    }
    async init(req) {
        await super.init(req)
        return this
    }
    dump() {
        console.log(Object.getOwnPropertyNames(this))
    }
    get insertId() {
        return this._insertId
    }
    get insertIds() {
        return this._insertIds
    }
    async $posts(record) {
        var response = new Array()
        response = {
            code: 201,
            status: 'mix',
            timestamp: Date.now(),
            length: { success: 0, failure: 0 },
            data: [],
        }
        this._insertIds = []
        for (var singleRecord of record) {
            //console.log(singleRecord);
            var res = await this.$post(singleRecord)
            response.data.push(res)
            if (res.status === 'success') {
                response.length.success = response.length.success + 1

            } else {
                response.length.failure = response.length.failure + 1
            }
            this.insertIds.push(this.insertId)
        }
        return response
    }
    ////////////////
    async $post(record = undefined, skipRawVals = false) {
        if( skipRawVals == true){
            console.log(record)
        }
        var postValsResponse
        var response
        var record
        if (record === undefined) {
            record = this.body
        }
        if (Array.isArray(record)) {
            this.response = this.$posts(record)
            return this.response
        }
        await this.model.model.create(record)
            .then(async data => {
                this._insertId = data.id
                response = {
                    code: 201,
                    status: 'success',
                    timestamp: Date.now(),
                    data: data,
                }
                if (skipRawVals === false) {
                    console.log('ddddddddddddddddddddd')
                    this.response = response
                    postValsResponse = await this.$postVals(record);
                    response.rawValsCode = postValsResponse.code
                }
            }).catch(async error => {
                //console.log(error);
                this._insertId = false
                response = {
                    code: 500,
                    status: 'error',
                    timestamp: Date.now(),
                    desc: 'There is a problem with inserting data to database!',
                    error: error,
                }
            })
        this.response = response
        return this.response
    }

    async $postRelations(record) {
        var response = []
        for (const singleRecord of record) {
            response.push(await this.$postRelation(singleRecord))
        }
        return response
    }
    /////////////////
    /*
left hand must exist
right hand will be inserted
    */
    async $postRelation(record = undefined) {
        var leftRelId
        var response
        if (record === undefined) {
            record = this.body
        }
        if (Array.isArray(record)) {
            this.response = await this.$postRelations(record)
            return this.response
        }
        //check is first part exists
        //this.model = model
        var model = this.model
        var firstCollection = this.collection
        this.query = { id: this.params[0] }
        await this.$exist()
        if (this.exist) {
            this.model = this.params[2]
            var secondCollection = this.collection
            // for check existing add record to query
            this.query = record
            await this.$exist()
            //check is second part exists
            if (this.exist === false) {
                //console.log('right hand not exits')
                //insert related data
                //on setting of this.body saveid added and form is necessary for each record
                this.body = record
                response = await this.$post();
                //console.log(a,this.insertId);
                if (this.insertId === false) {
                    //console.log('there is problem with inserting relational data')
                    response = {
                        code: 500,
                        status: 'error',
                        timestamp: Date.now(),
                        desc: 'there is problem with inserting right hands relational data!',
                        //error: await errorHandler(error),
                    }
                    leftRelId = false
                } else {
                    leftRelId = this.insertId
                    postValsResponse = await this.$postVals();
                    response.rawValsCode = postValsResponse.code

                }
            } else {
                leftRelId = this.existDoc.id
            }

            if (leftRelId !== false) {
                var first = { tableId: firstCollection, rowId: this.params[0] }
                var second = { tableId: secondCollection, rowId: leftRelId }
                //console.log(first);
                //console.log(second);
                await this.$addRelationOnly(first, second);
                this.model = model
                //response = this.addRelationResult
            }
        } else {
            console.log('left hand not exits')
            response = {
                code: 500,
                status: 'error',
                timestamp: Date.now(),
                desc: 'left hand pf relation is not exits!',
                //error: await errorHandler(error),
            }
        }
        //console.log(response);
        this.response = response
        return this.response
    }
    /*
set relation between two existing records in two tables
if there is no form name in body it means its data is relied on 
    */
    async $addRelationOnly(first, second) {
        first.rowId = parseInt(first.rowId)
        second.rowId = parseInt(second.rowId)
        //console.log(first)
        //console.log(second)

        /*************
         * get the name of first part table id
         */

        if (this.$isNumeric(first.tableId) === false) {
            first.tableStr = first.tableId
            this.model = 'tables';
            await this.$getByCol('name', first.tableId)
            first.tableId = this.getByColDoc.id
            //console.log(first.tableStr)
            if (Number.isInteger(first.tableId) == false) {
                this.addRelationResult = {
                    code: 500,
                    status: 'error',
                    timestamp: Date.now(),
                    desc: first.tableStr + ' is not a table name',
                    //error: await errorHandler(error),
                }
            }
        }
        /*************
         * get the name of second part table id
         */
        if (this.$isNumeric(second.tableId) === false) {
            second.tableStr = second.tableId
            //console.log(second.tableStr)

            this.model = 'tables';
            await this.$getByCol('name', second.tableId)
            second.tableId = this.getByColDoc.id

            /*
                        if (1 === 1) {
                            //for the first time it will be NaN because it is not created yet
                          ///  second.tableId = this.getByColDoc.id
            
                        } else {
                            //this.mongoose.connection.db.createCollection(second.tableId, (err) => {});
                        }*/
            /*************
             * check second tables exists and return correct value
             */
            if (Number.isInteger(second.tableId) == false) {
                this.addRelationResult = {
                    code: 500,
                    status: 'error',
                    timestamp: Date.now(),
                    desc: second.tableStr + ' is not a table name',
                    //error: await errorHandler(error),
                }
            }
        }
        //console.log(first);
        //console.log(second);

        var relations_model = require(__basedir + '/models/relations.model.js');
        var model = this.model
        this.model = relations_model
        var query1 = { row_id_1: first.rowId, table_id_1: first.tableId, row_id_2: second.rowId, table_id_2: second.tableId }
        var query2 = { row_id_2: first.rowId, table_id_2: first.tableId, row_id_1: second.rowId, table_id_1: second.tableId }
        this.query = { $or: [query1, query2] }

        //console.log(this.query);
        if (await this.$exist() === false) {
            /* if (this.body.form === undefined) {
                 this.addRelationResult = {
                     code: 500,
                     status: 'error',
                     timestamp: Date.now(),
                     desc: 'form is necesspoary in body!',
                     //error: await errorHandler(error),
                 }
             }
             */
            //this.body = query1
            //this._body[i].saveId = this.$uniqueString()
            //if directly by a form make relation it will be used
            if (this.body.form !== undefined){
                query1.form = this.body.form
            }
            query1.saveId = this.$uniqueString()
            this.addRelationResult = await this.$post(query1);
        } else {
            this.addRelationResult = {
                code: 200,
                status: 'error',
                timestamp: Date.now(),
                desc: 'There is a relation before!',
                //error: await errorHandler(error),
            }
        }

        this.model = model
        return this.addRelationResult
    }
    set addRelationResult(value) {
        this._addRelationResult = value
    }
    get addRelationResult() {
        return this._addRelationResult
    }






    /*
    save rawvals which is necessary for editing form
    if insert is array every record must contian its form and saveId
    */



    async $postVals(data) {
        
        this.model = 'rawVals';
        if (data.form === undefined) {
            console.log('form name is not provided. so for this data is not possible load edit form.')
            response = {
                code: 500,
                status: 'error',
                timestamp: Date.now(),
                desc: 'rawVals not saved because form name is not provided. so for this data is not possible load edit form.!',
                //error: await errorHandler(error),
            }
        }
        if (data.saveId === undefined) {
            console.log('saveId is not provided. so for this data is not possible load edit form.')
            response = {
                code: 500,
                status: 'error',
                timestamp: Date.now(),
                desc: 'rawVals not saved because saveId is not provided. so for this data is not possible load edit form.!',
                //error: await errorHandler(error),
            }
        }

        var rawValsData = { saveId: data.saveId, form: data.form, data: data }
        console.log(rawValsData,';;;;;;;;;;;;;;;;;;');
        response = await this.$post(rawValsData, true);
        return response
    }





    async controller(req, afterInitCallBack = (() => { })) {
        var response
        await this.init(req)
        await afterInitCallBack();
        if (this.params[0] !== undefined) {
            if (this.isRelational) {
                if (this.$isNumeric(this.params[3])) {
                    var first = { tableId: this.collection, rowId: this.params[0] }
                    var second = { tableId: this.params[2], rowId: this.params[3] }
                    this.response = await this.$addRelationOnly(first, second)
                    await this.$postVals()
                } else {
                    this.response = await this.$postRelation()

                }
            } else {
                this.response = {
                    code: 404,
                    status: this.errors[404].status,
                    timestamp: Date.now(),
                    desc: this.errors[404].desc,
                    //data: new Array()
                    //error: await errorHandler(error),
                }
            }
        } else {
            this.response = await this.$post();
        }
        return this.response
    }
}
/*
class dbHelper extends generalDb {
    constructor() {
        super();
        this._model
        this._collection
        this._query
        this.addRelationResult
    }
    ////////////////////////////
    async init() {
        await super.init()
    }


    
       async howMany(model = undefined) {
           model = this.modelArg(model);
           return await model.model.find(this.query)
               .then(async data => {
                   this.howManyDocs = data
                   return data.length
               }).catch(async error => {
                   new Error(error)
               });
       }
       get getHowManyDocs() {
           return this.howManyDocs
       }


}
*/
module.exports = postDb
