
const getDb = require(__basedir + '/functions/getDb.class.js');
const postDb = require(__basedir + '/functions/postDb.class.js');
const patchDb = require(__basedir + '/functions/patchDb.class.js');
const deleteDb = require(__basedir + '/functions/deleteDb.class.js');

module.exports = { get: getDb, post: postDb, patch: patchDb, delete: deleteDb }
