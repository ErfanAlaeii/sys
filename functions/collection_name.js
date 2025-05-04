function collection_name(filename,type){
    const scriptCompletePath = filename.split('\\');
    const collectionName = scriptCompletePath[scriptCompletePath.length - 1].split('.')[0];
    return collectionName;
}
module.exports = collection_name;