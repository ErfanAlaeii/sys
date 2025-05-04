function prepareLimit(limitRaw){
    var limit = parseInt(limitRaw);
    if(isNaN(limit)){
        limit = 0;
    }
    return limit;
}
module.exports = prepareLimit