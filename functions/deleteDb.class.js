const getDb = require(__basedir + '/functions/getDb.class.js');

class patchDb extends getDb {
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



    async $delete(id) {
        var response
        //var a = await this.$getRelations()
        //console.log(a);
        //console.log(this.query);

        await this.model.model.findOneAndDelete({ id: id }, { new: false, upsert: false }).then(async deletedRecord => {
            if (deletedRecord === null) {
                response = {
                    code: 404,
                    status: 'fail',
                    timestamp: Date.now(),
                    desc: 'no record found!'
                    //error: await errorHandler(error),
                }
            } else {
                //this is optimizing relation table and cleaning it from refference to empty
                await this.$deleteRelationsOneToAll(id)
                //console.log(deletedRecord);
                response = {
                    code: 200,
                    status: 'success',
                    timestamp: Date.now(),
                    desc: 'Deleted correctly!'
                    //error: await errorHandler(error),
                }

            }
        }).catch(async error => {
            console.log(error);
            response = {
                code: 500,
                status: 'error',
                timestamp: Date.now(),
                desc: 'Not Deleted correctly!'
                //error: await errorHandler(error),
            }
        })
        return response
    }











    async $search() {
        this.group = {}
        var singleResponse
        var response
        var records = await super.$search();
        //console.log(records);
        if (records.length === 0) {
            response = {
                code: 404,
                status: 'fail',
                timestamp: Date.now(),
                desc: 'no record found!'
                //error: await errorHandler(error),
            }
            return response
        }
        response = {
            code: 200,
            status: '',
            timestamp: Date.now(),
            desc: 'mixed data!',
            length: { success: 0, failure: 0 },
            data: []
        }

        for (const singleRecord of records.data) {
            //this.query = { id: singleRecord.id }
            singleResponse = await this.$delete(singleRecord.id)
            //console.log(singleResponse);

            if (singleResponse.status === 'success') {
                response.length.success = response.length.success + 1
            } else {
                response.length.failure = response.length.failure + 1
            }
            response.data.push(singleResponse)
        }
        //console.log(response.data);

        if (response.length.failure === 0) {
            response.status = 'success'
        } else if (response.length.success === 0) {
            response.status = 'error'
        } else {
            response.status = 'mix'
        }
        //console.log(response);
        return response
    }



    /*
    
    */
    async $deleteRelationsManyToAll() {
        //localhost:2000/api/v1/tables/relations/ 
        var response
        var model = this.model
        var collection = this.collection
        this.model = 'tables'
        await this.$getByCol('name', collection)
        var tableId = this.getByColDoc.id
        ///console.log(tableId);
        this.model = 'relations'
        this.query = { $or: [{ table_id_1: tableId }, { table_id_2: tableId }] }
        response = await this.$search()
        this.model = model
        return response
    }
    async $deleteRelationsOneToMany() {
        //localhost:2000/api/v1/tables/relations/tests/12
        //localhost:2000/api/v1/tables/1/relations/tests/
        var response
        var model = this.model
        var collection = this.collection
        this.model = 'tables'
        await this.$getByCol('name', collection)
        var leftTableId = this.getByColDoc.id
        if (this.$isNumeric(this.params[0])) {
            //localhost:2000/api/v1/tables/1/relations/tests/
            var leftRowId = this.params[0]
            await this.$getByCol('name', this.params[2])
            var rightTableId = this.getByColDoc.id
            this.query = {
                $or: [{ table_id_1: leftTableId, row_id_1: leftRowId, table_id_2: rightTableId },
                { table_id_2: leftTableId, row_id_2: leftRowId, table_id_1: rightTableId }]
            }
        } else {
            //localhost:2000/api/v1/tables/relations/tests/12
            var rightRowId = this.params[2]
            await this.$getByCol('name', this.params[1])
            var rightTableId = this.getByColDoc.id
            this.query = {
                $or: [{ table_id_1: rightTableId, row_id_1: rightRowId, table_id_2: leftTableId },
                { table_id_2: rightTableId, row_id_2: rightRowId, table_id_1: leftTableId }]
            }

        }
        //console.log(this.query);
        this.model = 'relations'
        response = await this.$search()
        this.model = model
        return response



    }
    async $deleteRelationsManyToMany() {
        //localhost:2000/api/v1/tables/relations/tests/12
        //localhost:2000/api/v1/tables/1/relations/tests/
        var response
        var model = this.model
        var collection = this.collection
        this.model = 'tables'
        await this.$getByCol('name', collection)
        var leftTableId = this.getByColDoc.id
        await this.$getByCol('name', this.params[1])
        var rightTableId = this.getByColDoc.id
        if (this.$isNumeric(this.params[0])) {
            //localhost:2000/api/v1/tables/1/relations/tests/
            await this.$getByCol('name', this.params[2])
            var rightTableId = this.getByColDoc.id
            this.query = {
                $or: [{ table_id_1: leftTableId, table_id_2: rightTableId },
                { table_id_2: leftTableId, table_id_1: rightTableId }]
            }
        }
        //console.log(this.query);
        this.model = 'relations'
        response = await this.$search()
        this.model = model
        return response
    }
    async $deleteRelationsOneToAll(leftRowId = undefined) {
        //localhost:2000/api/v1/tables/1/relations
        var response
        var model = this.model
        var collection = this.collection
        this.model = 'tables'
        await this.$getByCol('name', collection)
        var leftTableId = this.getByColDoc.id
        //localhost:2000/api/v1/tables/1/relations/tests/
        if (leftRowId === undefined) {
            leftRowId = this.params[0]
        }
        this.query = {
            $or: [{ table_id_1: leftTableId, row_id_1: leftRowId },
            { table_id_2: leftTableId, row_id_2: leftRowId }]
        }
        console.log(this.query);
        this.model = 'relations'
        response = await this.$search()
        this.model = model
        return response

    }
    async $deleteRelationsOneToOne() {
        //localhost:2000/api/v1/tables/1/relations/tests/1

        var response
        var model = this.model
        var collection = this.collection
        this.model = 'tables'
        await this.$getByCol('name', collection)
        var leftTableId = this.getByColDoc.id
        var leftRowId = this.params[0]
        await this.$getByCol('name', this.params[2])
        var rightTableId = this.getByColDoc.id
        var rightRowId = this.params[3]
        this.query = {
            $or: [{ table_id_1: leftTableId, row_id_1: leftRowId, table_id_2: rightTableId, row_id_2: rightRowId },
            { table_id_2: leftTableId, row_id_2: leftRowId, table_id_1: rightTableId, row_id_1: rightRowId }]
        }
        //console.log(this.query);
        this.model = 'relations'
        response = await this.$search()
        this.model = model
        return response
    }
    async $deleteRelations() {
        var response
        //console.log(this.params)
        if (this.params[0] === 'relations') {
            //localhost:2000/api/v1/tables/relations/*********** */
            if (this.params[1] === undefined) {
                //localhost:2000/api/v1/tables/relations/ 
                console.log('affect all relation of left hand with any righthand');
                response = await this.$deleteRelationsManyToAll()
            } else {
                //is table
                console.log(this.params[2]);
                if (this.$isNumeric(this.params[2])) {
                    //localhost:2000/api/v1/tables/relations/tests/12
                    console.log('affect all relation of left hand in respect to right hand specific');
                    response = await this.$deleteRelationsOneToMany()
                } else {
                    //localhost:2000/api/v1/tables/relations/tests/
                    console.log('affect all relation of left hand in respect to all right hand');
                    response = await this.$deleteRelationsManyToMany()
                    //remove all relations of these two tables
                }
            }
        } else if (this.$isNumeric(this.params[0])) {
            if (this.params[1] === 'relations') {
                if (this.params[2] === undefined) {
                    //localhost:2000/api/v1/tables/1/relations
                    console.log('affect all relation of specific left hand ');
                    response = await this.$deleteRelationsOneToAll()
                } else {
                    if (this.$isNumeric(this.params[3])) {
                        // console.log(this.params)
                        response = await this.$deleteRelationsOneToOne()
                        //localhost:2000/api/v1/tables/1/relations/tests/1
                        console.log('affect only one specific relation ');
                    } else {
                        //localhost:2000/api/v1/tables/1/relations/tests
                        console.log('affect all relation of right hand');
                        response = await this.$deleteRelationsOneToMany()
                    }
                }
            } else {
                console.log('url is malformmated');
            }

        } else {
            console.log('url is malformmated');
        }
        return response
    }


    async $changes() {
        var model = this.model
        await this.$getByCol('name', 'tables')
        var tableId = this.getByColDoc.id
        if (this.params[0] === 'changes') {
            //localhost:2000/api/v1/tables/changes
            this.query = { table_id: tableId }
        } else {//this.params[1] === 'changes'
            //localhost:2000/api/v1/tables/1/changes
            this.query = { table_id: tableId, row_id: this.params[0] }
        }
        this.model = 'changes'
        console.log(this.query);
        response = await this.$search()
        this.model = model
        return response
    }












    async controller(req) {
        await this.init(req)
        switch (this.params[0]) {
            case 'all':
                this.query = {}
                response = await this.$search()
                break;
            case 'search':
                response = await this.$search()
                break;
            case 'deleteds':
                this.query = { deleted: true }
                response = await this.$search()
                break;
            case 'hiddens':
                this.query = { hidden: true }
                response = await this.$search()
                break;
            default:
                //const id = this.params[0];
                if (this.params[0] === 'relations' || (this.params[1] === 'relations' && this.$isNumeric(this.params[0]))) {
                    response = await this.$deleteRelations()
                } else if (this.params[0] === 'changes' || this.params[1] === 'changes') {
                    //console.log('sssssssssssssss');
                    response = await this.$changes();
                } else if (this.$isNumeric(this.params[0])) {
                    response = await this.$delete(this.params[0])
                } else {
                    response = {
                        code: this.errors[404],
                        status: this.errors[404].status,
                        timestamp: Date.now(),
                        desc: this.errors[404].desc
                        //error: await errorHandler(error),
                    }
                }
        }
        this.response = response
        return response
    }
}

module.exports = patchDb
