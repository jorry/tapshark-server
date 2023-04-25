//发邮件
var nodemailer = require('nodemailer');
const {xor} = require("mysql/lib/protocol/Auth");
const crypto = require('crypto');
const passwrodRestSaveHelper = require('./loginPasswordResetCheckTimeOut');

function sendMail() {}
module.exports = sendMail;

function generateResetToken() {
    const buffer = crypto.randomBytes(20);
    return buffer.toString('hex');
}

async function sendEmail(email) {
    var smtpTransport = nodemailer.createTransport({
        host: 'owa.finupgroup.com',
        post: '587',
        ecure: false,
        auth: {
            user: 'liujiawei@iqianjin.com',
            pass: 'qqqqqqq1.'
        }
    });
    var resetToken = "resetToken="+generateResetToken()+"&";
    var resetUrl = "https://example.com/reset-password?resetToken="+resetToken+"&email="+email+"";
    var mailOptions = {
        from: 'liujiawei@iqianjin.com',
        to: email,
        subject: 'Reset Password Notification',
        text: "You are receiving this email because we received a password reset request for your account.\r\ncopy and paste the URL below into your web browser: "+resetUrl+ "If you did not request a password reset, no further action is required.\r\nRegards,\r\n E-Card"
    };
    console.log('发送邮件'+mailOptions);


    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mailOptions, function (error, response) {
            console.log("sendMail.Promise -> "+error);
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

sendMail.insert = function (email,callback){
    sendEmail(email).then((result) => {
        console.log("这里为什么没有进来")
        passwrodRestSaveHelper.insertEmailAndToken(email,function (error,status){
            console.log("callbackr = "+status);
            if (error){
               callback( null,-1);
           }else{
               callback(null,1 );
           }
        });
    }).catch((error) =>{
        console.log("catch error = "+error);
        callback(-1, null);
    });
}