const prepareSkip = require(__basedir + '/functions/prepare_skip.js');
const prepareLimit = require(__basedir + '/functions/prepare_limit.js');

function pagination(pageParam, pageParamNumber, limitParam, skipParam) {
    if (pageParam == "page") {
        var limit = prepareLimit(limitParam);
        if (isNaN(limit) || limit <= 0) {
            limit = 5;
        }
        var skip = (pageParamNumber * limit) - limit;
    } else {
        var limit = prepareLimit(limitParam);
        var skip = prepareSkip(skipParam);
    }
    return [limit,skip]
}
module.exports = pagination