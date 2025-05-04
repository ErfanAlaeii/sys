function path_mvc(filename,type){
    const scriptCompletePath = filename.split('\\');
    var scriptPath = scriptCompletePath[scriptCompletePath.length - 2];
    if(scriptPath == type+'s'){
        scriptPath = '';
    }else{
        scriptPath = scriptPath+'/';
    }
    const collectionName = scriptCompletePath[scriptCompletePath.length - 1].split('.')[0];
    return __basedir+'/'+type+'s/'+collectionName+'.'+type+'.js';
}
module.exports = path_mvc