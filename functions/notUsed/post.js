const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const connect = require(__basedir + '/functions/connect.js');
const post = (async (req, next, model) => {
    await connect();
    records = req.body;
    if (Array.isArray(records)) {
        var response = [];
        for (const single of records) {
            await model.model.create(single)
                .then(async data => {
                    result = {
                        code: 201,
                        status: 'success',
                        timestamp: Date.now(),
                        data: data,
                    }
                })
                .catch(async error => {
                    console.log(error)
                    result = {
                        code: 500,
                        status: 'error',
                        timestamp: Date.now(),
                        desc: 'There is a problem with inserting data to database!',
                        //error: await errorHandler(error),
                    }
                });
            response.push(result)
        }
    } else {
        await model.model.create(records)
            .then(async data => {
                result = {
                    code: 201,
                    status: 'success',
                    timestamp: Date.now(),
                    data: data,
                }
        }).catch(async error => {
                console.log(error);
                result = {
                    code: 500,
                    status: 'error',
                    timestamp: Date.now(),
                    desc: 'There is a problem with inserting data to database!',
                    //error: await errorHandler(error),
                }

            })
    }

    next();
    return response
});
module.exports = post;