function prepareSkip(skiptRaw){
    var skip = parseInt(skiptRaw);
    if(isNaN(skip)){
        skip = 0;
    }
    return skip;
}
module.exports = prepareSkip