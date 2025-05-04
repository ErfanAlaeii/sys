const errorHandler = require(__basedir + '/controllers/errorHandler.js');
const connect = require(__basedir + '/functions/connect.js');

const patchAll = (async (req, res, next,model) => {
    await connect();

    await model.model.find({})
    .then(async data => {
        data.forEach(async record =>  {
            this.tableId = 1;
            this.rowId = record.id;
            
            var original = await model.model.findOneAndUpdate({"id":record.id},req.body,{new:false});
           // console.log(original);

        });
       /* response = {
            code: 200,
            status: 'success',
            timestamp: Date.now(),
            length: data.length,
            data: data,
        }*/
       response = {'sssssss':22};
    }).catch(async error => {
        response = {
            code: 500,
            status: 'error',
            timestamp: Date.now(),
            desc: 'There is a problem with database when we are retrieving data!'
            //error: errorHandler(error),
        }
    })








/*


    await model.model.updateMany({}, req.body, { data: req.body })
        .then(async data => {
            response = {
                code: 204 ,
                status: 'success',
                timestamp: Date.now(),
                data: data,
    }
        }).catch(async error => {
            response = {
                code: 500 ,
                status: 'error',
                timestamp: Date.now(),
                desc: 'There is a problem with database when we are retrieving data from <tables> table!'
                //error: await errorHandler(error),
            }
        })
            */
    return response
});
module.exports = patchAll;