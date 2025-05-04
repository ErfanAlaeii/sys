
const generalDb = require(__basedir + '/functions/generalDb.class.js');
const fs = require('node:fs');


class getDb extends generalDb {
    constructor() {
        super()
        return this
    }
    async init(req) {
        await super.init(req)
        return this
    }
    ///////////////////////////////////
    async $exist(model = undefined) {
        await this.model.model.find(this.query).limit(1)
            .then(async data => {
                if (data.length > 0) {
                    this.existDoc = data[0]
                    this._exist = true
                } else {
                    this._exist = false
                }
            }).catch(async error => {
                new Error(error)
                this._exist = undefined
            });
        return this._exist

    }
    get exist() {
        return this._exist
    }
    set existDoc(value) {
        this._existDoc = value
    }
    get existDoc() {
        return this._existDoc
    }
    /////////////////////////

    ////////////////////////////
    async $getById(id) {
        await this.model.model.find({ id: id }).select('').limit(1)
            .then(async data => {
                if (data.length === 1) {
                    this.getByIdDoc = data[0]
                } else {
                    this.getByIdDoc = false;
                }
            }).catch(async error => {
                this.getByIdDoc = undefined;
            })
    }

    set getByIdDoc(value) {
        this._getByIdDoc = value
    }
    get getByIdDoc() {
        return this._getByIdDoc
    }////////////////////

    ////////////////////////////
    async $getByCol(col, colVal) {
        await this.model.model.find({ [col]: colVal }).select('').limit(1)
            .then(async data => {
                if (data.length === 1) {
                    this.getByColDoc = data[0]
                } else {
                    this.getByColDoc = false;
                }
            }).catch(async error => {
                this.getByColDoc = undefined;
            })
    }

    set getByColDoc(value) {
        this._getByColDoc = value
    }
    get getByColDoc() {
        return this._getByColDoc
    }
    async $count() {
        await this.model.model.countDocuments(this.query)
            .then(async data => {
                response = {
                    code: 200,
                    status: 'success',
                    timestamp: Date.now(),
                    //length: data.length,
                    data: data,
                }
            }).catch(async error => {
                response = {
                    code: 500,
                    status: 'error',
                    timestamp: Date.now(),
                    desc: 'There is a problem with database when we are retrieving data!'
                    //error: await errorHandler(error),
                }
            });
        return response;

    }
    async $getRelations() {
        //localhost:2000/api/v1/tables/56/relation/tests
        //localhost:2000/api/v1/tables/56/relations/
        var id = this.params[0]
        var tableCollection = 'tables'
        var relationCollection = 'relations'

        this.model = tableCollection
        var firstCollection = this.collection
        await this.$getByCol('name', firstCollection)
        var firstTableId = this.getByColDoc.id
        if (this.params[2] !== undefined) {
            var secondCollection = this.params[2]
            await this.$getByCol('name', secondCollection)
            var secondTableId = this.getByColDoc.id

            this.query = {
                $or: [
                    { $and: [{ table_id_1: firstTableId }, { row_id_1: id }, { table_id_2: secondTableId }] },
                    { $and: [{ table_id_2: secondTableId }, { row_id_2: id }, { table_id_1: firstTableId }] }
                ]
            }
        } else {
            this.query = {
                $or: [
                    { $and: [{ table_id_1: firstTableId }, { row_id_1: id }] },
                    { $and: [{ table_id_2: firstTableId }, { row_id_2: id }] }
                ]
            }
        }
        this.model = relationCollection
        return await this.$search()
    }
    ////////////////////
    async $search() {
        var dataLength

        console.log(this.query, 'this.query');
        console.log(this.select, 'this.select');
        console.log(this.sort, 'this.sort');
        console.log(this.limit, 'this.limit');
        console.log(this.skip, 'this.skip');
        console.log(this.group, 'this.group');
        console.log(this.sort, 'this.sort');
        console.log(this.showHiddens, 'this.showHiddens');
        console.log(this.showDeleteds, 'this.showDeleteds');

        await this.model.model.find(this.query).select(this.select).sort(this.sort).limit(this.limit).skip(this.skip)
            .then(async data => {
                dataLength = data.length
                if (dataLength > 0) {
                    data = this.$deepGroupBy(data, this.group)
                    //data = {...data ,fid_mobile: data .fid.mobile}
                    response = {
                        code: 200,
                        status: 'success',
                        timestamp: Date.now(),
                        length: dataLength,
                        data: data,
                    }
                } else {
                    response = {
                        code: 404,
                        status: 'error',
                        timestamp: Date.now(),
                        desc: 'Not found any record!',
                        //error: await errorHandler(error),
                    }
                }

            }).catch(async error => {
                console.log(error);
                response = {
                    code: 500,
                    status: 'error',
                    timestamp: Date.now(),
                    desc: 'There is a problem with database when we are retrieving data!',
                    //error: await errorHandler(error),
                }
            });

        /*for (var path in this.model.schema.paths) {
            //console.log(path, this.model.schema.paths[path].options.autopopulate)
            if (this.model.schema.paths[path].options.autopopulate) {
                for (var recNum in Object.keys(response.data)) {
                    if (response.data[recNum][path] !== undefined && response.data[recNum][path] !== NaN && response.data[recNum][path] !== null) {
                        console.log(response.data[recNum][path]);

                        response.data[recNum][path] = response.data[recNum][path].map((item) => {
                            //response.data[recNum][path][]
                          //console.log(item);
                        });
                    }
                }
            }
        }*/

        //console.log(this.model.schema.paths);
        /*
                response.data = response.data.map((item) => {
                    //console.log(item)
                    if ((item.fid !== null && item.fid !== undefined && item.fid !== NaN) ){
                    return {
                        "user.Role": item.fid.mobile,
                        busy: item.mobile,
                    };
                }
        
                })*/
        return response;
    }

    async $getChanges() {
        await this.$getByCol('name', 'tables')
        var tableId = this.getByColDoc.id
        var model = this.model
        this.model = 'changes'
        this.query = { table_id: tableId, row_id: this.params[0] }
        response = await this.$search();
        this.model = model
        return response
    }
    async $getLastChange() {
        await this.$getByCol('name', 'tables')
        var tableId = this.getByColDoc.id
        var model = this.model
        this.model = 'changes'
        this.prependSort = [["createdAt", -1]]
        this.limit = 1
        this.query = { table_id: tableId, row_id: this.params[0] }
        response = await this.$search();
        this.model = model
        return response
    }






































    async controller(req) {
        await this.init(req)
        switch (this.params[0]) {
            case 'all':
                this.query = {}
                response = await this.$search();
                break;
            case 'search':
                response = await this.$search();
                break;
            case 'hiddens':
                this.$addToQuery({ hidden: true })
                response = await this.$search();
                break;
            case 'lastHiddens':
                this.$addToQuery({ hidden: true })
                this.prependSort = [["hiddenAt", -1]]
                response = await this.$search();
                break;
            case 'unhiddens':
                this.$addToQuery({ hidden: false })
                response = await this.$search();
                break;
            case 'lockeds':
                get.$addToQuery({ locked: true })
                response = await this.$search();
                break;
            case 'lastLockeds':
                this.$addToQuery({ locked: true })
                get.prependSort = [["lockedAt", -1]]
                response = await this.$search();
                break;
            case 'unlockeds':
                this.$addToQuery({ locked: false })
                response = await this.$search();
                break;
            case 'deleteds':
                this.$addToQuery({ deleted: true })
                response = await this.$search();
                break;
            case 'lastDeleteds':
                this.$addToQuery({ deleted: true })
                this.prependSort = [["deletedAt", -1]]
                response = await this.$search();
                break;
            case 'undeleteds':
                this.$addToQuery({ deleted: false })
                response = await this.$search();
                break;
            case 'modifieds':
                this.$addToQuery({ modifiedAt: { $ne: null } })
                response = await this.$search();
                break;
            case 'lastModifieds':
                this.$addToQuery({ modifiedAt: { $ne: null } })
                this.prependSort = [["modifiedAt", -1]]
                response = await this.$search();
                break;
            case 'unmodifieds':
                this.$addToQuery({ modifiedAt: null })
                response = await this.$search();
                break;
            case 'lastCreateds':
                this.prependSort = [["createdAt", -1]]
                response = await this.$search();
                break;
            case 'count':
                response = await this.$count();
                break;
            case 'help':
                response = {
                    status: 'success',
                    data: "For more info check https://doc.hesab-ketab.com",
                }
                break;
            case 'form':
                if (this.params[1] === 'add') {
                    try {
                        console.log(this.collection)
                        fs.readFile(__basedir + '/forms' + '/' + this.collection + '.add.html', 'utf8', (err, data) => {
                            if (err) {
                                console.error(err);
                                response = {
                                    code: 404,
                                    status: this.errors[404].status,
                                    timestamp: Date.now(),
                                    desc: this.errors[404].desc
                                    //error: await errorHandler(error),
                                }
                            }
                            response = {
                                status: 'success',
                                data: data,
                            }
                        });
                    } catch (e) {
                        response = {
                            code: 404,
                            status: this.errors[404].status,
                            timestamp: Date.now(),
                            desc: this.errors[404].desc
                            //error: await errorHandler(error),
                        }
                    }

                } else if (this.params[1] === 'edit') {
                    try {
                        console.log(this.collection)
                        fs.readFile(__basedir + '/forms' + '/' + this.collection + '.add.html', 'utf8', (err, data) => {
                            if (err) {
                                console.error(err);
                                response = {
                                    code: 404,
                                    status: this.errors[404].status,
                                    timestamp: Date.now(),
                                    desc: this.errors[404].desc
                                    //error: await errorHandler(error),
                                }
                            }
                            response = {
                                status: 'success',
                                data: data,
                            }
                        });
                    } catch (e) {
                        response = {
                            code: 404,
                            status: this.errors[404].status,
                            timestamp: Date.now(),
                            desc: this.errors[404].desc
                            //error: await errorHandler(error),
                        }
                    }

                }
                break;
            default:
                const id = this.params[0]
                if (typeof id === 'number') {
                    switch (this.params[1]) {
                        case 'changes':
                            response = await this.$getChanges();
                            break;
                        case 'lastChange':
                            response = await this.$getLastChange();
                            break;
                        case 'relations':
                            //localhost:2000/api/v1/tables/56/relation/tests
                            //localhost:2000/api/v1/tables/56/relations/
                            response = await this.$getRelations();
                            break;
                        default:
                            this.$addToQuery({ id: id })
                            response = await this.$search();
                            break;
                    }
                } else {
                    response = {
                        code: 404,
                        status: this.errors[404].status,
                        timestamp: Date.now(),
                        desc: this.errors[404].desc
                        //error: await errorHandler(error),
                    }
                }
                break;
        }
        this.response = response
        return response

    }
}
module.exports = getDb
