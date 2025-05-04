
const general = require(__basedir + '/functions/general.class.js');
class generalDb extends general {
    constructor() {
        super();
        this.mongoose
        this.connection
        this.req
        this.model
        this.collection
        this.params
        this.sort
        this.limit
        this.skip
        this.query
        this.isPaginated
        this.pageNumber
        this.group
        this.select
        this.body
        this.prependSort
        this.showDeleteds
        this.showHiddens
        this.prependSort
        //this.isRelational
        //this.isRelationalToSpecific
    }

    async init(req, model) {
        await super.init()
        this.mongoose = true;
        await this.$connect();
        this.defaultPageLimit = 5
        //this.model = model

        this.$extract(req);
    }
    /////////////////////////////////
    set mongoose(value) {
        this._mongoose = require("mongoose");
    }
    get mongoose() {
        return this._mongoose
    }
    //////////////////////////////////////
    set connection(value) {
        this._connection = value
    }
    get connection() {
        return this._connection
    }
    async $connect() {
        this.connection = await this.mongoose.connect(process.env.mongoDB)
            .catch(error => {
                new Error('not possible connecting database');
                response = {
                    code: 500,
                    status: 'error',
                    timestamp: Date.now(),
                    desc: 'Can not stablish connection with database!',
                    data: error,
                }
                return undefined
            });
    }
    async $method(req) {
        this.method = req.method.toUpperCase()
    }
    //////////////////////////////////////////////////
    set model(value) {
        //console.log(value,'A');
        this.$model(value);
        //console.log(value,'Z');

        //return this._model;

        /*return (async () => {
        })();*/
    }
    get model() {
        return this._model;
    }
    $model(value = undefined) {
        if (typeof value === 'string') {
            // console.log(value,'B');
            try {
                //console.log(__basedir + '/models/' + value + '.model.js');
                //console.log(__basedir + '/models/' + value + '.model.js','C');

                value = require(__basedir + '/models/' + value + '.model.js');
                //console.log(__basedir + '/models/' + value + '.model.js');
                // console.log(value,'iiiiiiiiiii');

            } catch (error) {
                //console.log(value,'vvvvvvvvvvvvv');

                error => {
                    new Error('not possible find model file');
                    response = {
                        code: 500,
                        status: 'error',
                        timestamp: Date.now(),
                        desc: 'not possible find model file!',
                        data: error,
                    }
                }
                return false
            }
        }
        //console.log(value,'aa');

        if (value !== undefined && typeof value === 'object') {
            if (typeof value.schema.options.collection === 'string') {
                this.collection = value.schema.options.collection
                this._model = value

            } else {
                this._model = undefined
                new Error('model provided not working');
            }
        }
        return this.model
    }
    ////////////////////////////////////
    async $listCollections() {
        this._listCollections = await this.mongoose.createConnection(process.env.mongoDB).listCollections()
    }
    get listCollections() {
        return this._listCollections
    }
    set collection(value) {
        //set it by modal
        this._collection = value
    }
    get collection() {
        return this._collection
    }
    ////////////////////////////////
    /*
    str => req or str.params[0]
    
    */
    $params(str) {
        //var paramsArray = req.params[0].split('/');
        if (typeof str === 'object') {
            str = str.params[0]
        }
        if (str === undefined) {
            str = new String("")
        }
        var paramsArray = str.split('/');
        if (paramsArray[0] === "") {
            this._params = {}
            return {}
        }
        this._params = paramsArray.reduce((obj, item, index) => {
            if (this.$isNumeric(item)) {
                item = parseInt(item)
            } else if (item === null || item.trim() === "") {
                item = undefined
            } else {
                item = item.trim()
            }
            obj[index] = item;
            return obj;
        }, {});
    }
    set params(value) {
        this.$params(value)
    }
    get params() {
        return this._params
    }






















    //////////////////////////////////////////
    /*
this is used for changing string of 1 or -1 to number in sort query because if it be an string not worked
    */
    $sortFormatValues(arr) {
        //console.log(arr,'444');
        if (Array.isArray(arr) === false) {
            return []
        }
        var mainSort
        if (Object.entries(arr) > 0) {
            for (const [key, value] of Object.entries(arr)) {
                if (mainSort[key] === "1") {
                    mainSort[key] = 1;
                }
                if (mainSort[key] === "-1") {
                    mainSort[key] = -1;
                }
            }
        } else {
            mainSort = arr
        }
        return mainSort
    }
    /////////////////////////////////////

    $getSortArray(str, queryName) {
        var sortArr
        var strs
        console.log(this.method)
        if (str instanceof Object) {
            if (Array.isArray(str)) {
                sortArr = str
                sortArr = this.$sortFormatValues(sortArr)
                //this._sort = sortArr
            } else {
                if (this.$isReq(str)) {
                    //console.log();
                    if (typeof str.query[queryName] === 'undefined') {
                        //an correct object but empty sort
                        //console.log(1)

                        sortArr = []
                        //this._sort = sortArr
                    } else if (str.query[queryName] === null) {
                        //console.log(2)

                        sortArr = []
                    } else if (typeof str.query[queryName] === 'string' && str.query[queryName].trim() === '') {
                        //console.log(3)
                        sortArr = []
                    } else {
                        //console.log(4)
                        sortArr = str.query[queryName]
                    }
                    try {
                        str = JSON.parse(sortArr)
                        if (Array.isArray(str)) {
                            sortArr = str
                            sortArr = this.$sortFormatValues(sortArr)
                            //this._sort = sortArr
                        } else {
                            sortArr = []
                            //this._sort = sortArr
                        }
                    } catch (e) {
                        //console.log(e)
                        console.log('there is error with parsing json of sort query')
                        sortArr = []
                    }
                } else {
                    //an incorrect object
                    sortArr = []
                }
            }
        } else if (str instanceof String) {
            //console.log('str instanceof String');
            if (str.trim() === "") {
                //an correct object but empty sort
                sortArr = []
                //this._sort = []
                //return this._sort
            } else {
                sortArr = []
                strs = str.split(',')
                for (const singleStr of strs) {
                    sortArr.push([singleStr.trim(), 1])
                }
                //this._sort = sortArr
            }
        } else if (str === undefined) {
            //console.log('str === undefined');
            //can be splitted by comma also must be trimmed
            sortArr = []
            //this._sort = sortArr
        }
        /*
        try {


        } catch {
        try {
            prependSort = JSON.parse(this.prependSort);
            new Error('sort is not parseable, prepended sort is applied');
            sort = prependSort;

        } catch {
            new Error('prepended sort and sort is not parseable');
            sort = [];
        }
    }*/
        return sortArr

    }
    ////////////////////////////////
    //just array and result is array of array
    $sort(str) {
        if (this.method == 'GET') {
            this._sort = this.$getSortArray(str, 'sort')
        } else {
            this._sort = undefined
        }
        return this._sort;
    }
    set sort(value) {
        this.$sort(value)
    }
    get sort() {
        return this._sort
    }

    $applyPrependSort(value) {

        this._prependSort = this.$getSortArray(value, 'prependSort')
        try {
            for (var keySort = 0; keySort < this._sort.length; keySort++) {
                console.log(this._sort[keySort][0]);
                for (var keyPrependSort = 0; keyPrependSort < this._prependSort.length; keyPrependSort++) {
                    console.log(this._prependSort[keyPrependSort][0]);

                    if (this._prependSort[keyPrependSort][0] === this._sort[keySort][0]) {
                        this._sort.splice(keySort, 1);
                    }
                }
            }
            this._sort = this.prependSort.concat(this.sort);
            //console.log(this._sort, 'concat');

        } catch {
            new Error('prepended sort is not parseable');
            //this._sort = mainSort
        }
        return this._sort
    }
    set prependSort(value) {
        this._sort = this.$applyPrependSort(value);
        return this.sort

    }
    get prependSort() {
        return this._prependSort
    }










    ///////////////////////////////////////
    $limit(str) {
        if (typeof str === 'object') {
            str = str.query.limit
        }
        var limit = parseInt(str);
        //if its string and cant be converted
        if (isNaN(limit)) {
            limit = 0;
        }
        //this.$pagination()
        this._limit = limit
        return limit;
    }
    set limit(value) {
        this.$limit(value)
    }
    get limit() {
        return this._limit
    }
    ///////////////////////////////////////
    $skip(str) {
        var skip
        if (typeof str === 'object') {
            str = str.query.skip
        }
        skip = parseInt(str);
        //if its string and cant be converted
        if (isNaN(skip)) {
            skip = 0;
        }
        //this.$pagination()
        this._skip = skip
        return this.skip;
    }
    set skip(value) {
        this.$skip(value)
    }
    get skip() {
        return this._skip
    }
    ///////////////////////////////////
    $query(value) {
        var query
        if (this.$isReq(value)) {
            //console.log(value.query.query)
            query = value.query.query
        } else {
            query = value
        }

        if (typeof query === 'object') {
            this._query = query
        } else {
            try {
                this._query = JSON.parse(query);
            } catch {
                //console.log('query has a problem is not json format');
                this._query = {}
            }
        }
        //console.log(this.showDeleteds ,'this.showDeleteds this.showDeleteds this.showDeleteds this.showDeleteds this.showDeleteds this.showDeleteds ')

        this.showDeleteds = this.req
        if (this.showDeleteds === false) {
            //this.query ={$and:[{deleted:false},this._query]}
            this.$addToQuery({ deleted: false })
        }
        this.showHiddens = this.req
        if (this.showHiddens === false) {
            //this.query ={$and:[{hidden:false},this._query]}
            this.$addToQuery({ hidden: false })
        }
        //this._query ={ $and:[{deleted: false}, {hidden: true}] }
        //this._query ={ $and:[{deleted: true}, {hidden: true}] }
    }
    set query(value) {
        this.$query(value)
    }
    get query() {
        return this._query
    }
    $addToQuery(value) {
        this._query = this.$mergeDeep(this.query, value)
    }
    /////////////////////////////
    $isPaginated() {
        //balabala/page/1/
        var length = Object.keys(this.params).length
        if (this.params[length - 1] === 'page') {
            //balabala/page
            this.pageNumber = 1
            this.isPaginated = true
        } else if (this.params[length - 2] === 'page') {
            //balabala/page/1
            this.pageNumber = parseInt(this.params[length - 1])
            this.isPaginated = true
        } else if (this.params[length - 3] === 'page') {
            //balabala/page/1
            this.pageNumber = parseInt(this.params[length - 2])
            this.isPaginated = true
        } else {
            this.isPaginated = false
        }
        return this.isPaginated
    }
    set pageNumber(value) {
        if (isNaN(value)) {
            value = 1
        }
        this._pageNumber = value
    }
    get pageNumber() {
        return this._pageNumber
    }
    set isPaginated(value) {
        this._isPaginated = value
    }
    get isPaginated() {
        return this._isPaginated
    }
    set defaultPageLimit(value) {
        this._defaultPageLimit = value
    }
    get defaultPageLimit() {
        return this._defaultPageLimit
    }
    $pagination(value) {
        this.$isPaginated()
        if (this.isPaginated) {
            //var limit = prepareLimit(limitParam);
            this.limit = value
            if (this.limit <= 0) {
                this.limit = this.defaultPageLimit;
            }
            //console.log();
            this.skip = (this.pageNumber * this.limit) - this.limit;
        } else {
            this.limit = value
            this.skip = value
        }
        return [this.limit, this.skip]
    }
    ////////////////////////////////////////
    $group(value) {
        var group
        if (this.$isReq(value)) {
            group = value.query.group
        } else {
            group = value
        }
        if (group === undefined) {
            group = []
        }
        this._group = group
        return this.group;
    }
    set group(value) {
        this.$group(value)
    }
    get group() {
        return this._group
    }
    ////////////////////////////////////////
    $select(value) {
        var select
        if (this.$isReq(value)) {
            select = value.query.select
        } else {
            select = value
        }
        if (select === undefined) {
            select = ""
        }
        this._select = select
        return this.select;
    }

    set select(value) {
        this.$select(value)
    }
    get select() {
        return this._select
    }
    set showHiddens(value) {

        var showHiddens
        if (this.$isReq(value)) {
            showHiddens = value.query.showHiddens
        } else {
            showHiddens = value
        }
        this._showHiddens = this.$isYes(showHiddens)
        /*if(this._showHiddens === false){
            this.query ={$and:[{hidden:false},this.query]}
        }*/
    }
    get showHiddens() {
        return this._showHiddens
    }
    set showDeleteds(value) {
        var showDeleteds
        if (showDeleteds === 'undefined') {
            this._showDeleteds = 0
        } else if (this.$isReq(value)) {
            showDeleteds = value.query.showDeleteds
        } else {
            showDeleteds = value
        }
        this._showDeleteds = this.$isYes(showDeleteds)

    }
    get showDeleteds() {
        return this._showDeleteds;
    }

    //////////////////////////////////
    set body(value) {
        this.$body(value)
    }
    get body() {
        return this._body
    }
    /*
     * value : accept body or req and extract req.body
     * for method post it will be added and value will change a little
     * 
     * 
     */

    $body(value) {
        var req
        if (this.$isReq(value)) {
            req = value.body
        } else {
            req = value
        }
        try {
            this._body = JSON.parse(JSON.stringify(req))
            this.$addSaveId()
        } catch {
            if (req === undefined) {
                this._body = undefined
            } else {
                this._body = false
                console.log('body in malformmatted');
            }
        }
    }

    $addSaveId() {
        if (this.method === 'POST') {
            var bodyIsArray = Array.isArray(this.body);
            if (bodyIsArray) {
                for (let i = 0, len = this.body.length; i < len; i++) {
                    this._body[i].saveId = this.$uniqueString()
                }
            } else {
                this._body.saveId = this.$uniqueString()
            }
        }
        return this.body
    }
    ///////////////////////////////
    $isRelational() {
        //console.log(this.params[1] == 'relations');
        //console.log(this.$isNumeric(this.params[0]));
        this._isRelational = (this.$isNumeric(this.params[0]) && this.params[1] == 'relations')
        if (this._isRelational === true && this.$isNumeric(this.params[3])) {
            this._isRelationalToSpecific = true
        } else {
            this._isRelationalToSpecific = false
        }
        return this._isRelational
    }
    get isRelational() {
        this.$isRelational()
        return this._isRelational
    }
    get isRelationalToSpecific() {
        return this._isRelationalToSpecific
    }
    ///////////////////////////////
    $extract(req) {
        //console.log(model,66666666666);
        //console.log(req.query.query );
        //req.query.query = decodeURIComponent(req.query.query) // אובמה

        //console.log(req.query.query );
        this.req = req
        this.$method(this.req);
        //this.showDeleteds = req
        //this.showHiddens = req
        this.model = this.$requireModel()
        this.params = this.req
        this.query = this.req
        this.sort = this.req
        this.select = this.req
        this.group = this.req

        this.method = this.req.method
        this.body = this.req
        this.$pagination(this.req)
        //console.log(this.params)
        //console.log(this.query)
        //this.$isRelational()

    }
    $requireModel() {
        var path;
        var modelName
        var collectionName
        var defaultPrepareStackTrace = Error.prepareStackTrace
        Error.prepareStackTrace = function (err, stack) { return stack; };
        try {
            //  if (collectionName === undefined) {
            var err = new Error();
            path = err.stack[err.stack.length - 1].getFileName()
            //console.log(path);
            var type = 'model'

            const scriptCompletePath = path.split('\\');
            var scriptPath = scriptCompletePath[scriptCompletePath.length - 2];
            if (scriptPath == type + 's') {
                scriptPath = '';
            } else {
                scriptPath = scriptPath + '/';
            }
            collectionName = scriptCompletePath[scriptCompletePath.length - 1].split('.')[0];
            //}

            modelName = __basedir + '/' + type + 's/' + collectionName + '.' + type + '.js';
            //console.log(collectionName);

        } catch (err) {
        }
        //console.log(collectionName);
        Error.prepareStackTrace = defaultPrepareStackTrace
        return collectionName;

    }
}
module.exports = generalDb
