const db = require(__basedir + '/functions/db.js');
//const axios = require('axios')
//const nodemailer = require('nodemailer');
//const moment = require('moment');
user = { id: 1 }
/************************************ */
const postApi = (async (req, res, next) => {
    const post = await new db.post();
    response = await post.controller(req);
    await post.$postVals();
    post.$sendRes(res, next)
});
/************************************ */
const getApi = (async (req, res, next) => {
    const get = await new db.get();
    response = await get.controller(req);
    get.$sendRes(res, next)

});
/************************************ */
const patchApi = (async (req, res, next) => {
    const patch = await new db.patch();
    req.user = user;
    response = await patch.controller(req)
    patch.$sendRes(res, next)
});
/************************************ */
const deleteApi = (async (req, res, next) => {
    const del = await new db.delete();
    req.user = user;
    await del.controller(req)
    del.$sendRes(res, next)
})
/************************************ */
module.exports = {
    getApi,
    postApi,
    deleteApi,
    patchApi,
}
