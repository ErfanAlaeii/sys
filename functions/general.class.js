const validator = require(__basedir + '/functions/validator.class.js');

class general extends validator {
    constructor() {
        super();
        return this
    }
    async init() {
        await super.init()
        return this
    }
    /**
 * https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
* Performs a deep merge of objects and returns new object. Does not modify
* objects (immutable) and merges arrays via concatenation.
*
* @param {...object} objects - Objects to merge
* @returns {object} New object with merged key/values
*/
    $mergeDeep(...objects) {
        const isObject = obj => obj && typeof obj === 'object';
        return objects.reduce((prev, obj) => {
            Object.keys(obj).forEach(key => {
                const pVal = prev[key];
                const oVal = obj[key];

                if (Array.isArray(pVal) && Array.isArray(oVal)) {
                    prev[key] = pVal.concat(...oVal);
                }
                else if (isObject(pVal) && isObject(oVal)) {
                    prev[key] = this.$mergeDeep(pVal, oVal);
                }
                else {
                    prev[key] = oVal;
                }
            });

            return prev;
        }, {});
    }
    $groupBy(arr, branch) {
        return Object.groupBy(arr, item => item[branch]);
    }

    $deepGroupBy(arr, branches) {
        if (typeof branches === 'string' || branches instanceof String) {
            branches = branches.split(',').map(function (item) { return item.trim(); });
        }
        if (Array.isArray(branches) === false) {
            return arr;
        }
        if (branches.length === 0) {
            return arr
        } else if (branches.length === 1) {
            return this.$groupBy(arr, branches[0]);
        } else {
            const groupedObj = this.$groupBy(arr, branches[0]);
            for (const prop of Object.keys(groupedObj)) {
                groupedObj[prop] = this.$deepGroupBy(groupedObj[prop], branches.slice(1)); // notice the recursion here
            }
            return groupedObj;
        }
    }
    $isReq(value) {
        if (value.res) {
            return true
        } else {
            return false
        }
    }
    get errors (){
        var _errors = {}
        _errors[404] = {status:'route',desc:'there is not such route'}
        return _errors
    }
    set response(value){
        this._response = value
    }    
    get response(){
        return this._response
    }
    $sendRes(res,next){
        next()
        res.set('X-Powered-By', 'ShahabRent.com')
        if(this.response.code !== undefined){
           // res.status(this.response.code);
        }
        res.json(this.response);
    }
    $makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }
    $uniqueString(){
        return Date.now()+'-'+ this.$makeid(12)
    }
    $isYes(value){
        //1 , yes ,true  will return true means yes
        if(typeof value == 'string' ){
            value = value.toLowerCase();
            if(value == 'true' || value == 'yes' || value == '1'){
                return true;
            } else{
                return false;
            }
        }else if(typeof value == 'number' ){
            if(value == 1){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
}
module.exports = general
