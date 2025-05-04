
class validator {
    constructor() {
        return this
    }
    async init() {
        //await super.init()

    }
    $isNumeric(value) {
        return /^\d+$/.test(value);
    }
}
module.exports = validator
