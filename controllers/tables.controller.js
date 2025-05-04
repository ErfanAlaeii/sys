const db = require(__basedir + '/functions/db.js');
user = { id: 1 }
async function postAuto(response, post) {
    await post.$listCollections()
    var body = []
    for (var i = 0; i < post.listCollections.length; i++) {
        body.push({ name: post.listCollections[i].name })
    }
    post.body = body
    response = await post.$post();
    post.response = {
        code: 201,
        status: 'success',
        timestamp: Date.now(),
        length: response.length,
        data: response,
    }
    return post.response
}
/************************************ */
const postApi = (async (req, res, next) => {
    //localhost:2000/api/v1/tables/56/relations/tests
    const post = await new db.post();
    post.response = await post.controller(req);
    if (post.params[0] === 'auto') {
        //this api without table and couter table requires run twice
        post.response = await postAuto(response, post)
    }
    post.$sendRes(res, next)
});
/************************************ */
const getApi = (async (req, res, next) => {
    const get = await new db.get();
    get.response = await get.controller(req);
    get.$sendRes(res, next)

});
/************************************ */
const patchApi = (async (req, res, next) => {
    const patch = await new db.patch();
    req.user = user;
    patch.response = await patch.controller(req)
    patch.$sendRes(res, next)
});
/************************************ */
const deleteApi = (async (req, res, next) => {
    const del = await new db.delete();
    req.user = user;
    del.response = await del.controller(req)
    del.$sendRes(res, next)
})
/************************************ */
module.exports = {
    postApi: postApi,
    getApi: getApi,
    patchApi: patchApi,
    deleteApi: deleteApi,
}
