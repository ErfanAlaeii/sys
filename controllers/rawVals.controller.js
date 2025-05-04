const db = require(__basedir + '/functions/db.js');
//const axios = require('axios')
//const nodemailer = require('nodemailer');
//const moment = require('moment');
user = { id: 1 }
/************************************ */
const postApi = (async (req, res, next) => {
});
/************************************ */
const getApi = (async (req, res, next) => {
    //console.log('aaaaaaaaaaaaaaaaaaa');
    const get = await new db.get();
    response = await get.controller(req);
    get.$sendRes(res, next)
});
/************************************ */
const patchApi = (async (req, res, next) => {
});
/************************************ */
const deleteApi = (async (req, res, next) => {
})
/************************************ */
module.exports = {
    getApi,
    postApi,
    deleteApi,
    patchApi,
}
