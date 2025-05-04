console.log('test4:', 'include controller');
const path_mvc = require(__basedir + '/functions/path_mvc.js');
const path_model = path_mvc(__filename, 'model');
console.log('test5:', 'controller before include model');
const model = require(path_model);
var axios = require('axios')


const connect = require(__basedir + '/functions/connect.js');

const getSearch = require(__basedir + '/functions/get_search.js');
const getChanges = require(__basedir + '/functions/get_changes.js');
const getCount = require(__basedir + '/functions/get_count.js');

const post = require(__basedir + '/functions/post.js');

const deleteSearch = require(__basedir + '/functions/delete_search.js');

const patchSearch = require(__basedir + '/functions/patch_search.js');

const putSearch = require(__basedir + '/functions/put_search.js');
const nodemailer = require('nodemailer');

const moment = require('moment');

const { generate } = require('mongoose-data-faker');
user = { id: 1 }
/************************************ */
const postApi = (async (req, res, next) => {
    req.body.otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    if (req.body.hasOwnProperty('email') === false && req.body.hasOwnProperty('email') === false) {
        response = {
            code: 400,
            status: 'error',
            timestamp: Date.now(),
            desc: 'provide email or mobile!'
            //error: await errorHandler(error),
        }
    } else {
        if (req.body.hasOwnProperty('email')) {
            sendOtpEmail(req.body.email, req.body.otp);
        }
        if (req.body.hasOwnProperty('mobile')) {
            sendOtpSms(req.body.mobile, req.body.otp);
        }

        response = await post(req, next, model);
    }

    next();
    res.json(response);
});
/************************************ */

const patchApi = (async (req, res, next) => {
    await connect()
    req.user = user;
    //validateBody();
    params = req.params[0].split('/')
    param0 = params[0]
    param1 = params[1]
    param2 = params[2]
    switch (param0) {
        case 'all':
            req.query.query = {};
            response = await patchSearch(req, next, model);
            break;
        case 'search':
            response = await patchSearch(req, next, model);
            break;
        case 'delete':
            switch (param1) {
                case 'all':
                    req.query.query = {};
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, deleted: true }
                    response = await patchSearch(req, next, model);
                    break;
                case 'search':
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, deleted: true }
                    response = await patchSearch(req, next, model);
                    break;
                default:
                    const id = parseInt(param1);
                    if (typeof id === 'number') {
                        req.query.query = { id: id };
                        req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, deleted: true }
                        response = await patchSearch(req, next, model);
                    } else {
                        response = {
                            code: 400,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is not such route'
                            //error: await errorHandler(error),
                        }
                    }
                    break;
            }
            break;
        case 'undelete':

            switch (param1) {
                case 'all':
                    req.query.query = {};
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, deleted: false }
                    response = await patchSearch(req, next, model);
                    break;
                case 'search':
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, deleted: false }
                    response = await patchSearch(req, next, model);
                    break;
                default:
                    const id = parseInt(param1);
                    if (typeof id === 'number') {
                        req.query.query = { id: id };
                        req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, deleted: false }
                        response = await patchSearch(req, next, model);
                    } else {
                        response = {
                            code: 400,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is not such route'
                            //error: await errorHandler(error),
                        }
                    }
                    break;
            }            break;
        case 'hide':
            switch (param1) {
                case 'all':
                    req.query.query = {};
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, hidden: true }
                    response = await patchSearch(req, next, model);
                    break;
                case 'search':
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, hidden: true }
                    response = await patchSearch(req, next, model);
                    break;
                default:
                    const id = parseInt(param1);
                    if (typeof id === 'number') {
                        req.query.query = { id: id };
                        req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, hidden: true }
                        response = await patchSearch(req, next, model);
                    } else {
                        response = {
                            code: 400,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is not such route'
                            //error: await errorHandler(error),
                        }
                    }
                    break;
            }
            break;
        case 'unhide':
            switch (param1) {
                case 'all':
                    req.query.query = {};
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, hidden: false }
                    response = await patchSearch(req, next, model);
                    break;
                case 'search':
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, hidden: false }
                    response = await patchSearch(req, next, model);
                    break;
                default:
                    const id = parseInt(param1);
                    if (typeof id === 'number') {
                        req.query.query = { id: id };
                        req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, hidden: false }
                        response = await patchSearch(req, next, model);
                    } else {
                        response = {
                            code: 400,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is not such route'
                            //error: await errorHandler(error),
                        }
                    }
                    break;
            }
            break;
        case 'lock':
            switch (param1) {
                case 'all':
                    req.query.query = {};
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, locked: true }
                    response = await patchSearch(req, next, model);
                    break;
                case 'search':
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, locked: true }
                    response = await patchSearch(req, next, model);
                    break;
                default:
                    const id = parseInt(param1);
                    if (typeof id === 'number') {
                        req.query.query = { id: id };
                        req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, locked: true }
                        response = await patchSearch(req, next, model);
                    } else {
                        response = {
                            code: 400,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is not such route'
                            //error: await errorHandler(error),
                        }
                    }
                    break;
            }
            break;
        case 'unlock':
            switch (param1) {
                case 'all':
                    req.query.query = {};
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, locked: false }
                    response = await patchSearch(req, next, model);
                    break;
                case 'search':
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, locked: false }
                    response = await patchSearch(req, next, model);
                    break;
                default:
                    const id = parseInt(param1);
                    if (typeof id === 'number') {
                        req.query.query = { id: id };
                        req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, locked: false }
                        response = await patchSearch(req, next, model);
                    } else {
                        response = {
                            code: 400,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is not such route'
                            //error: await errorHandler(error),
                        }
                    }
                    break;
            }
            break;
        default:
            const id = parseInt(param0);
            if (typeof id === 'number') {
                req.query.query = { id: id };
                response = await patchSearch(req, next, model);
            } else {
                response = {
                    code: 400,
                    status: 'error',
                    timestamp: Date.now(),
                    desc: 'There is not such route'
                    //error: await errorHandler(error),
                }
            }
            break;
    }
    next();
    res.json(response);

});

/************************************ */
const getApi = (async (req, res, next) => {
    params = req.params[0].split('/')
    param0 = params[0]
    param1 = params[1]
    param2 = params[2]
    switch (param0) {
        case 'all':
            req.query.query = {};
            response = await getSearch(req, next, model);
            break;
        case 'search':
            response = await getSearch(req, next, model);
            break;
        case 'count':
            response = await getCount(req, next, model);
            break;
        case 'hiddens':
            response = await getSearch(req, next, model, { hidden: true });
            break;
        case 'lastHiddens':
            response = await getSearch(req, next, model, { hidden: true }, { "hiddenAt": -1 });
            break;
        case 'unhiddens':
            response = await getSearch(req, next, model, { hidden: false });
            break;
        case 'lockeds':
            response = await getSearch(req, next, model, { locked: true });
            break;
        case 'lastLockeds':
            response = await getSearch(req, next, model, { locked: true }, { "lockedAt": -1 });
            break;
        case 'unlockeds':
            response = await getSearch(req, next, model, { locked: false });
            break;
        case 'deleteds':
            response = await getSearch(req, next, model, { deleted: true });
            break;
        case 'lastDeleteds':
            response = await getSearch(req, next, model, { deleted: true }, { "deletedAt": -1 });
            break;
        case 'undeleteds':
            response = await getSearch(req, next, model, { deleted: false });
            break;
        case 'modifieds':
            response = await getSearch(req, next, model, { modifiedAt: { $ne: null } });
            break;
        case 'lastModifieds':
            response = await getSearch(req, next, model, { modifiedAt: { $ne: null } }, { "modifiedAt": -1 });
            break;
        case 'unmodifieds':
            response = await getSearch(req, next, model, { modifiedAt: null });
            break;
        case 'lastCreateds':
            response = await getSearch(req, next, model, {}, { "createdAt": -1 });
            break;
        case 'help':
            response = {
                status: 'success',
                data: "For more info check https://doc.hesab-ketab.com",
            }
            break;
        default:
            const id = parseInt(param0);
            if (typeof id === 'number') {
                switch (param1) {
                    case 'changes':
                        //console.log('run changes');
                        response = await getChanges(req, next, model);
                        break;
                    default:
                        req.query.query = { id: id }
                        response = await getSearch(req, next, model, {});
                        break;
                }
            } else {
                response = {
                    code: 400,
                    status: 'error',
                    timestamp: Date.now(),
                    desc: 'There is not such route'
                    //error: await errorHandler(error),
                }
            }
            break;
    }
    next();
    res.json(response);
});
/************************************ */
const deleteApi = (async (req, res, next) => {
    await connect()
    params = req.params[0].split('/')
    param0 = params[0]
    param1 = params[1]
    param2 = params[2]
    switch (param0) {
        case 'all':
            req.query.query = {}
            response = await deleteSearch(req, next, model)
            break;
        case 'search':
            response = await deleteSearch(req, next, model, {});
            break;
        case 'deleteds':
            response = await deleteSearch(req, next, model, { deleted: true });
            break;
        case 'hiddens':
            response = await deleteSearch(req, next, model, { hidden: true });
            break;
        default:
            const id = parseInt(param0);

            if (typeof id === 'number') {
                switch (param2) {
                    case 'changes':
                        //response = await deleteChanges(req, next, model);
                        break;
                    default:
                        req.query.query = { id: id }
                        response = await deleteSearch(req, next, model);
                        break;
                }
            } else {
                response = {
                    code: 400,
                    status: 'error',
                    timestamp: Date.now(),
                    desc: 'There is not such route'
                    //error: await errorHandler(error),
                }
            }

    }
    next();
    res.json(response);
})
module.exports = {
    getApi,
    postApi,
    deleteApi,
    patchApi,
    // putApi
}
/*
const putApi = (async (req, res, next) => {
    await connect()
    params = req.params[0].split('/')
    param0 = params[0]
    param1 = params[1]
    param2 = params[2]
    switch (param0) {
        case 'all':
            req.query.query = {};
            response = await putSearch(req, next, model);
            break;
        case 'search':
            response = await putSearch(req, next, model);
            break;
        case 'delete':
            switch (param1) {
                case 'all':
                    req.query.query = {};
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, deleted: true }
                    response = await putSearch(req, next, model);
                    break;
                case 'search':
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, deleted: true }
                    response = await putSearch(req, next, model);
                    break;
                default:
                    const id = parseInt(param1);
                    if (typeof id === 'number') {
                        req.query.query = { id: id };
                        req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, deleted: true }
                        response = await putSearch(req, next, model);
                    } else {
                        response = {
                            code: 400,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is not such route'
                            //error: await errorHandler(error),
                        }
                    }
                    break;
            }
            break;
        case 'undelete':

            switch (param1) {
                case 'all':
                    req.query.query = {};
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, deleted: false }
                    response = await putSearch(req, next, model);
                    break;
                case 'search':
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, deleted: false }
                    response = await putSearch(req, next, model);
                    break;
                default:
                    const id = parseInt(param1);
                    if (typeof id === 'number') {
                        req.query.query = { id: id };
                        req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, deleted: false }
                        response = await putSearch(req, next, model);
                    } else {
                        response = {
                            code: 400,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is not such route'
                            //error: await errorHandler(error),
                        }
                    }
                    break;
            }            break;
        case 'hide':
            switch (param1) {
                case 'all':
                    req.query.query = {};
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, hidden: true }
                    response = await putSearch(req, next, model);
                    break;
                case 'search':
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, hidden: true }
                    response = await putSearch(req, next, model);
                    break;
                default:
                    const id = parseInt(param1);
                    if (typeof id === 'number') {
                        req.query.query = { id: id };
                        req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, hidden: true }
                        response = await putSearch(req, next, model);
                    } else {
                        response = {
                            code: 400,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is not such route'
                            //error: await errorHandler(error),
                        }
                    }
                    break;
            }
            break;
        case 'unhide':
            switch (param1) {
                case 'all':
                    req.query.query = {};
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, hidden: false }
                    response = await putSearch(req, next, model);
                    break;
                case 'search':
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, hidden: false }
                    response = await putSearch(req, next, model);
                    break;
                default:
                    const id = parseInt(param1);
                    if (typeof id === 'number') {
                        req.query.query = { id: id };
                        req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, hidden: false }
                        response = await putSearch(req, next, model);
                    } else {
                        response = {
                            code: 400,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is not such route'
                            //error: await errorHandler(error),
                        }
                    }
                    break;
            }
            break;
        case 'lock':
            switch (param1) {
                case 'all':
                    req.query.query = {};
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, locked: true }
                    response = await putSearch(req, next, model);
                    break;
                case 'search':
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, locked: true }
                    response = await putSearch(req, next, model);
                    break;
                default:
                    const id = parseInt(param1);
                    if (typeof id === 'number') {
                        req.query.query = { id: id };
                        req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, locked: true }
                        response = await putSearch(req, next, model);
                    } else {
                        response = {
                            code: 400,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is not such route'
                            //error: await errorHandler(error),
                        }
                    }
                    break;
            }
            break;
        case 'unlock':
            switch (param1) {
                case 'all':
                    req.query.query = {};
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, locked: false }
                    response = await putSearch(req, next, model);
                    break;
                case 'search':
                    req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, locked: false }
                    response = await putSearch(req, next, model);
                    break;
                default:
                    const id = parseInt(param1);
                    if (typeof id === 'number') {
                        req.query.query = { id: id };
                        req.body = { deletedAt: moment().valueOf(), deletedBy: user.id, locked: false }
                        response = await putSearch(req, next, model);
                    } else {
                        response = {
                            code: 400,
                            status: 'error',
                            timestamp: Date.now(),
                            desc: 'There is not such route'
                            //error: await errorHandler(error),
                        }
                    }
                    break;
            }
            break;
        default:
            const id = parseInt(param0);
            if (typeof id === 'number') {
                req.query.query = { id: id };
                response = await putSearch(req, next, model);
            } else {
                response = {
                    code: 400,
                    status: 'error',
                    timestamp: Date.now(),
                    desc: 'There is not such route'
                    //error: await errorHandler(error),
                }
            }
    break;
    }
    next();
    res.json(response);

});
*/























/*
const getGenerate = (async (req, res, next) => {
    tempResponse = await generate(model.schema, req.params.param2);
    response = []
    tempResponse.forEach(element => {
        delete element._id
        delete element.createdAt
        delete element.createdBy
        delete element.modifiedAt
        delete element.modifiedBy
        delete element.deleted
        delete element.deletedAt
        delete element.deletedBy
        delete element.hidden
        delete element.hiddendAt
        delete element.hiddenBy
        delete element.locked
        delete element.lockedAt
        delete element.lockedBy
        delete element.__v
        response.push(element)
    });
    return response
})
















/////////////////////////////////////////////////////////////////////////
/*
const putApi = (async (req, res, next) => {
    await connect()
    response = await putSingle(req, res, next)
    res.json(response);

}
)

const putSingle = (async (req, res, next) => {
    
    await model.model.findOneAndReplace({ _id: req.params.param1 }, req.body, { data: req.body, new: true })
        .then(async data => {
            response = {
                status: 'success',
                data: data,
            }
        }).catch(async error => {
            response = {
                status: 'error',
                error: await errorHandler(error),
            }
        })
    return response

})
*/














/*
case 'markeds':
response = await getSearch(req, next, model, { marked: true });
break;
case 'lastMarkeds':
response = await getSearch(req, next, model, {}, { "markedAt": -1 });
break;

case 'unmarkeds':
response = await getSearch(req, next, model, { marked: false });
break;
case 'flaggeds':
response = await getSearch(req, next, model, { flagged: true });
break;
case 'lastFlaggeds':
response = await getSearch(req, next, model, {}, { "flaggedAt": -1 });
break;
case 'unflaggeds':
response = await getSearch(req, next, model, { flagged: false });
break;
case 'favoriteds':
response = await getSearch(req, next, model, { favorited: true });
break;
case 'lastFavoriteds':
response = await getSearch(req, next, model, {}, { "favoritedAt": -1 });
break;
case 'unfavoriteds':
response = await getSearch(req, next, model, { favorited: false });
break;
*/
/*
case 'generate':
    response = await getGenerate(req, res, next)
    break;
*/