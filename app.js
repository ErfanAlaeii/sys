require('express-group-routes');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const app = express();

const port = process.env.PORT;
const apiRoute = process.env.APIROUTE;
global.__basedir = __dirname;
app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json())

app.group("/api",  (apiVerRouter) => {
    apiVerRouter.group("/v1", (router) => {
        router.get((req, res, next) => {
        })
        router.post((req, res, next) => {
        })
        router.patch((req, res, next) => {
        })
        router.put((req, res, next) => {
        })
        router.delete((req, res, next) => {
        })
            try {
                var fs = require('fs');
                var files = fs.readdirSync(__basedir + '/routers');
                for (var i = 0; i < files.length; i++) {
                    var file = files[i]
                    if (file.startsWith('-') === false) {
                        var routerFn = require(apiRoute + file);
                        var collectionName = file.split('.')[0]
                        response = router.use('/' + collectionName, routerFn);
                    }
                }
            } catch (error) {
                console.log(error);
            }

            return response;

    });
});
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
