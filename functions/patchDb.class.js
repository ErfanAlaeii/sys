const getDb = require(__basedir + '/functions/getDb.class.js');
const moment = require('moment');

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
    async $patch(id = undefined, data = undefined) {
        var response
        if (id === undefined) {
            id = this.param[0]
        }
        if (data) {
            data = this.body
        }
        await this.model.model.findOneAndUpdate({ id: id }, data, { new: false, upsert: false }).then(async singleRecordData => {
            response = {
                code: 200,
                status: 'success',
                timestamp: Date.now(),
                desc: 'Updated correctly!'
                //error: await errorHandler(error),
            }
        }).catch(async error => {
            response = {
                code: 200,
                status: 'error',
                timestamp: Date.now(),
                desc: 'Updated correctly!'
                //error: await errorHandler(error),
            }
        })
        return response
    }
    /***************************
     * 
     */
    async $operation(operation) {
        switch (this.params[0]) {
            case 'delete':
                this.body = { deletedAt: moment().valueOf(), deletedBy: user.id, deleted: true }
                break;
            case 'undelete':
                this.body = { deletedAt: moment().valueOf(), deletedBy: user.id, deleted: false }
                break;
            case 'hide':
                this.body = { hiddenAt: moment().valueOf(), hiddenBy: user.id, hidden: true }
                break;
            case 'unhide':
                this.body = { hiddenAt: moment().valueOf(), hiddenBy: user.id, hidden: false }
                break;
            case 'lock':
                this.body = { lockedAt: moment().valueOf(), lockedBy: user.id, locked: true }
                break;
            case 'unlock':
                this.body = { lockedAt: moment().valueOf(), lockedBy: user.id, locked: false }
                break;
        }
        switch (this.params[1]) {
            case 'all':
                this.query = {};
                break;
            case 'search':
                break;
            default:
                const id = this.params[1];
                if (typeof id === 'number') {
                    this.query = { id: id };
                } else {
                    response = {
                        code: 400,
                        status: 'error',
                        timestamp: Date.now(),
                        desc: 'There is not such route'
                        //error: await errorHandler(error),
                    }
                }
                break;
        }
        response = await this.$search()
        this.response = response
        return response
    }
    async $search() {
        this.group = {}
        var records = await super.$search();
        console.log(records);
        var singleResponse
        var response
        response = {
            code: 200,
            status: '',
            timestamp: Date.now(),
            desc: 'mixed data!',
            length: { success: 0, failure: 0 },
            data: []
        }
        for (const singleRecord of records.data) {
            singleResponse = await this.$patch(singleRecord.id, this.body)
            if (singleResponse.status === 'success') {
                response.length.success = response.length.success + 1
            } else {
                response.length.failure = response.length.failure + 1
            }
            response.data.push(singleResponse)
        }
        if (response.length.failure === 0) {
            response.status = 'success'
        } else if (response.length.success === 0) {
            response.status = 'error'
        } else {
            response.status = 'mix'
        }

        return response
    }














    

    async controller(req) {
        await this.init(req)
        switch (this.params[0]) {
            case 'all':
                this.query = {};
                response = await this.$search()
                break;
            case 'search':
                response = await this.$search()
                break;
            case 'delete':
            case 'undelete':
            case 'hide':
            case 'unhide':
            case 'lock':
            case 'unlock':
                response = await this.$operation(this.params[0])
                break;
            default:
                //localhost:2000/api/v1/tables/56
                const id = this.params[0];
                if (this.$isNumeric(this.params[0])) {
                    this.query = { id: id };
                    response = await this.$search()
                } else {
                    response = {
                        code: this.errors[404],
                        status: this.errors[404].status,
                        timestamp: Date.now(),
                        desc: this.errors[404].desc
                        //error: await errorHandler(error),
                    }
                }
                break;
        }
        this.response = response
        console.log(response);
        return response
    }
}
module.exports = patchDb
