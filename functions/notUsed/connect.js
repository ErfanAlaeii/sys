const mongoose = require("mongoose");

async function connect() {
    return await mongoose.connect(process.env.mongoDB).catch(error => {
        response = {
            code: 500,
            status: 'error',
            timestamp: Date.now(),
            desc: 'Can not stablish connection with database!'
            //data: error,
        }
    });
}
module.exports = connect