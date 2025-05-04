const db = require(__basedir + '/functions/db.js');
const axios = require('axios')
const nodemailer = require('nodemailer');

user = { id: 1 }
async function sendOtpEmail(to, otp) {
    emailService = {
        pool: true,
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "shahab.tabatabaei.1984@gmail.com",
            pass: "cjbv kisl fnyi jhzz",
        }
    }
    const transporter = nodemailer.createTransport(emailService);
    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            //console.log(error);
        } else {
            //console.log("Server is ready to take our messages");
            mailOptions = {
                from: 'shahab.tabatabaei.1984@gmail.com',
                to: to,
                subject: 'کد ورود به سیستم',
                html: "<p>کد احراز هویت شما</p><br>" + otp
            }
            //mailOptions = eamilData;

            transporter.sendMail(mailOptions, function (error, response) {
                //console.log(response)
                if (error) {
                    //console.log(error);
                }
            });

        }
    });

}
async function sendOtpSms(to, otp, url = 'https://rest.payamakapi.ir/api/v1/SMS/Send') {
    await axios.post(url,
        {
            UserName: '09121010200',
            Password: '09121010822',
            From: '10002147',
            To: to,
            //Message: 'ورود به سامانه اجاره خودرو شهاب رنت/r/n کد تایید شما : ' + otp
            Message: 'ورود به سامانه اجاره خودرو طباطبایی\n\rکد تایید شما : ' + otp
        }, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}
async function sendOtp(req) {
    req.body.otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    var hasEmail = (req.body.email === undefined || req.body.email === '' || req.body.email === null)
    var hasMobile = (req.body.mobile === undefined || req.body.mobile === '' || req.body.mobile === null)
    if (hasEmail === false && hasMobile === false) {
        response = {
            code: 500,
            status: 'error',
            timestamp: Date.now(),
            desc: 'provide email or mobile!'
            //error: await errorHandler(error),
        }
    } else {
        if (hasEmail) {
            await sendOtpEmail(req.body.email, req.body.otp);
        }
        if (hasMobile) {
            await sendOtpSms(req.body.mobile, req.body.otp);
        }
    }
    return req;
}
/************************************ */
const postApi = (async (req, res, next) => {
    //localhost:2000/api/v1/tables/56/relations/tests
    req = await sendOtp(req)
    const post = await new db.post();
    response = await post.controller(req);
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
