//发邮件
var nodemailer = require('nodemailer');
const {xor} = require("mysql/lib/protocol/Auth");
const crypto = require('crypto');
const passwrodRestSaveHelper = require('./loginPasswordResetCheckTimeOut');
const db = require("./dbhelper");
const fs = require('fs');
function sendMail() {
}

module.exports = sendMail;

function generateResetToken() {
    const buffer = crypto.randomBytes(20);
    return buffer.toString('hex');
}

async function sendEmail(email,userName) {
    var smtpTransport = nodemailer.createTransport({
        host: 'owa.finupgroup.com',
        post: '587',
        auth: {
            user: 'liujiawei@iqianjin.com',
            pass: 'qqqqqqqq1.'
        }
    });
    var token = generateResetToken();
    const htmlTemplate = fs.readFileSync('./transfer_email.html', 'utf8');
    var resetToken = "resetToken=" + token;
    console.log("userName = "+userName);
    var resetPasswordUrl = "http://47.92.215.156/ECard6/reset.html?resetToken=" + resetToken + "&email=" + email + "";
    const emailBody = htmlTemplate.replace('{{username}}', userName).replaceAll("{{resetLink}}", resetPasswordUrl);
    console.log(emailBody)
    var mailOptions = {
        from: 'liujiawei@iqianjin.com',
        to: email,
        subject: 'Reset Password Notification',
        html: emailBody
        // text: "You are receiving this email because we received a password reset request for your account.\r\ncopy and paste the URL below into your web browser: " + resetUrl + "If you did not request a password reset, no further action is required.\r\nRegards,\r\n E-Card"
    };
    console.log('发送邮件' + mailOptions);


    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mailOptions, function (error, response) {
            console.log("sendMail.Promise -> " + error);
            if (error) {
                reject(error);
            } else {
                resolve(token);
            }
        });
    });
};

sendMail.insert = function (email, callback) {

    const selectUser = "select username from ecard_user_register where email = '" + email + "'";
    db.query(
        selectUser,
        function (err, rows, fields) {
            if (err) {
                console.log(err);
                callback(null, -1);
            } else {
                if (rows.length == 1) {
                    console.log("rows.username = "+rows[0].username)
                    sendEmail(email,rows[0].username).then((result) => {
                        console.log("发送邮件以后:result = "+result)
                        passwrodRestSaveHelper.insertEmailAndToken(email,result, function (error, status) {
                            console.log("callbackr = " + status);
                            if (error) {
                                callback(null, -1);
                            } else {
                                callback(null, 1);
                            }
                        });
                    }).catch((error) => {
                        console.log("catch error = " + error);
                        callback(-1, null);
                    });
                } else {
                    callback(null, 2);
                }
            }
        }
    );


}