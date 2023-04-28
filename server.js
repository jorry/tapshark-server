var express = require('express');
var app = express();
var fs = require("fs");
var http = require('http');
const path = require('path');
var formidable = require('formidable');
const rootPath = require('app-root-path');
const crypto = require('crypto');
const zlib = require('zlib');
var bodyParser = require('body-parser');
var httptet = require('./models/httptet');
var checkAuth = require('./models/checkAuth');
var checkAuthCookieArray = require('./models/checkAuthCookieArray');

var cryptoUtilsHelper = require('./models/cryptoUtils');
var messageModel = require('./config/message');
const cookieParser = require('cookie-parser');
var mainCard = require('./models/mainCard');
var nfcHelper = require('./models/nfcHelper');
var discountHelper = require('./models/discountCodeHelper');
var userRegisterHelper = require('./models/userRegisterHelper');
var loginHelper = require('./models/loginHelper');
var orderDetailUtils = require('./models/orderDetail');
var dateHelper = require('./models/dateUtils');
var sendMailHelper = require('./models/sendMail');
let personalInfoHelper = require('./models/personalInfoHelper');

var loginPasswordResetCheckTimeOutHelper = require('./models/loginPasswordResetCheckTimeOut');
var ftpUtils = require('./models/sftpUtil');
var cors = require('cors');
const checkCookieObjArrayHelper = require("./models/checkAuthCookieArray");
const secret = 'e4f4aef50468e375c36542a14c434c86';
app.use(cookieParser(secret));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.raw({
    type: 'binary/octet-stream',
    limit: '10mb'
}));
app.use(cors());

const sessionId = crypto.randomBytes(16).toString('hex');
app.use(cookieParser(sessionId));

//发邮件方法，参数：channel：渠道iOS或android ,subject邮件标题, html邮件内容

var response = function () {
    this.code;
    this.msg;
    this.body;
};

function publicServerError(res) {
    var obj = new response();
    obj.code = messageModel.public_server_error_code;
    obj.msg = messageModel.public_server_error;
    return res.end(JSON.stringify(obj));
}

function callBackErrorAlertMessage(res, msg) {
    var obj = new response();
    obj.code = -1;
    obj.msg = msg;
    return res.end(JSON.stringify(obj));
}

function responseUploadImgUrlBody(url) {
    var o = new Object();
    o.imgUrl = url;
    return o;
};


app.post('/testPost', function (req, res) {
    var obj = new response();
    obj.code = 1;
    obj.msg = "ok";
    return res.end(JSON.stringify(obj));
});

app.post("/ecard/upload/img", checkAuth, function (req, res) {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true; // 保留文件扩展名
    form.uploadDir = path.join(rootPath.path, '/src/temp'); // 临时存储路径
    form.parse(req, function (err, fileds, files) {
        if (err) {
            throw err;
        }
        const file2 = files.file;
        console.log('文件名:', file2.originalFilename);
        console.log('文件大小:', file2.size);
        const file = files.file;
        const name = file.originalFilename;
        const extensions = name.split('.').pop();
        const fileName = `${extensions}`;
        const filePath = file.filepath;

        // 从临时存储路径中读取文件
        const data = fs.readFileSync(filePath);
        console.log('大小:', data.length);

        let rootPath = path.resolve(__dirname, '../default'); //代码文件的根路径
        // 将读取文件保存到新的位置
        fs.writeFile(
            path.join(rootPath, '/file/') + name,
            data,
            function (err) {
                if (err) {
                    return console.log(err);
                }
                // 删除临时文件
                fs.unlink(filePath, function () {
                });
                // 返回文件服务器中该文件的url
                var obj = new response();
                obj.code = 1;
                obj.msg = "上传完成";
                obj.body = responseUploadImgUrlBody(`http://${req.host}/file/${name}`);
                return res.end(JSON.stringify(obj));
            }
        );
    });
});

app.post('/addUserOrder', checkAuth, function (req, res) {
    var createDate = new Date().getTime();
    var eventtime = dateHelper.getFormatDateByLong(createDate, "yyyy-MM-dd hh:mm:ss");
    orderDetailUtils.insertOrder("ex@gmail.com", 1, "red tree", 4, "0", "http://card_template_url", "http://customized_card_url",
        eventtime, "231aaqadsfad", function (status, error) {
            var obj = new response();
            if (error) {
                obj.code = 0;
                obj.msg = "插入失败";
                return res.end(JSON.stringify(obj));
            }

            obj.code = 1;
            obj.msg = "添加成功";
            return res.end(JSON.stringify(obj));
        });
});


app.post('/ecard/userLogin', function (req, res) {
    var email = req.body.body.email;
    if (email == null) {
        return callBackErrorAlertMessage(res, messageModel.email_1);
    } else if (!email.includes("@")) {
        return callBackErrorAlertMessage(res, messageModel.email_2);
    }

    var password = req.body.body.password;
    if (password == null) {
        return callBackErrorAlertMessage(res, messageModel.password);
    }
    loginHelper.insertRecord(email, password, function (status, error) {
        if (error) {
            return publicServerError(res);
        }
        if (status === 1) {
            const cookieOptions = {
                maxAge: 120 * 24 * 60 * 60 * 1000, // 120 天的有效期
                httpOnly: true, // 禁止客户端脚本访问 Cookie
                signed: true, // 启用签名
                sameSite: 'strict', // 防止跨站点请求伪造攻击
                secure: process.env.NODE_ENV === 'production', // 仅在 HTTPS 连接中使用 Cookie
            };
            let session_id = cryptoUtilsHelper.encrypt(email);
            res.cookie('session_id', session_id, cookieOptions);
            checkAuthCookieArray.checkCookieObjArray.push(session_id);
        }
        var obj = new response();
        obj.code = status;
        obj.msg = status == 0 ? messageModel.login_call_back : "登录成功";
        return res.end(JSON.stringify(obj));
    });
});


app.post('/ecard/register', function (req, res) {
    var ename = req.body.body.ename;
    if (ename == null) {
        return callBackErrorAlertMessage(res, messageModel.name);
    }
    var email = req.body.body.email;
    if (email == null) {
        return callBackErrorAlertMessage(res, messageModel.email_1);
    } else if (email.includes('@')) {
        if (email == null) {
            return callBackErrorAlertMessage(res, messageModel.email_2);
        }
    }

    var password = req.body.body.password;
    var confirmPassword = req.body.confirmPassword;
    console.log(password + "")
    if (password === confirmPassword) {
        return callBackErrorAlertMessage(res, messageModel.register_call_back_1);
    }
    if (password.length < 8) {
        return callBackErrorAlertMessage(res, messageModel.register_call_back_2);
    }
    var createDate = new Date().getTime();
    var eventtime = dateHelper.getFormatDateByLong(createDate, "yyyy-MM-dd hh:mm:ss");

    userRegisterHelper.register(ename, password, email, eventtime, eventtime, function (status, error) {
        var obj = new response();
        if (error) {
            if (status == 2) {
                obj.code = -1;
                obj.msg = messageModel.register_call_back_3;
            } else {
                obj.code = messageModel.public_server_error_code;
                obj.msg = public_server_error;
            }
            return res.end(JSON.stringify(obj));
        }
        obj.code = status;
        obj.msg = messageModel.register_call_back_4;
        return res.end(JSON.stringify(obj));
    });
});

/**
 * 密码重置
 */

app.post('/ecard/resetPassword', function (req, res) {
    var email = req.body.body.email;
    if (email == null) {
        return callBackErrorAlertMessage(res, messageModel.email_1);
    }
    console.log(email.includes("@"))
    if (!email.includes("@")) {
        return callBackErrorAlertMessage(res, messageModel.email_2);
    }
    var password = req.body.body.password;
    if (password == null) {
        return callBackErrorAlertMessage(res, messageModel.password_empty);
    }
    if (password.length < 8) {
        return callBackErrorAlertMessage(res, messageModel.register_call_back_2);
    }
    loginHelper.updatePassword(email, password, function (status, error) {
        if (error) {
            var obj = new response();
            obj.code = -1;
            obj.msg = "服务器请求失败";
            return res.end(JSON.stringify(obj));
        }
        var obj = new response();
        obj.code = status;
        if (status == 0) {
            obj.msg = messageModel.Email_not_exist;
        } else if (status == 1) {
            obj.msg = messageModel.password_reset_ssc;
        }

        return res.end(JSON.stringify(obj));
    });
});

/**
 * 用户主卡页
 */
app.post('/ecard/userMainCardPage', checkAuth, function (req, res) {
    var email = req.body.body.email;

    mainCard.selectUserCard(email, function (status, rows) {
        if (status == -1) {
            return publicServerError(res);
        }
        const list = rows.map(row => {
            return {
                company_logo: row.company_logo,
                user_name: row.user_name,
                user_logo: row.user_logo,
                card_material_url: row.card_material_url,
                user_name: row.card_num,
            };
        });
        var obj = new response();
        obj.code = 1;
        obj.msg = "ok";
        obj.body = list;
        return res.end(JSON.stringify(obj));
    });
});


/**
 * 这个接口好像没啥用
 */
app.post('/ecard/checkDiscountCode', function (req, res) {
    var email = req.body.body.email;
    var discountCode = req.body.body.discountCode;
    discountHelper.discountCheck(email, discountCode, function (status, error, message) {
        if (error) {
            return publicServerError(res);
        }
        var obj = new response();
        obj.code = status;
        obj.msg = message;
        return res.end(JSON.stringify(obj));
    });
});

app.get('/', function (req, res) {
    console.log("app.get('/'")
    req.send();
});

app.post('/test_get_coockie', checkAuth, function (req, res) {
    // 在这里获取用户信息并返回
    // const cookieValue = req.signedCookies['session_id'];
    console.log('test_get_coockie+' + req.userData)
    res.send(`Hello, ${req.userData}!`);
});

/**
 * test
 */
app.post('/saveCookie', function (req, res) {

    const cookieOptions = {
        maxAge: 120 * 24 * 60 * 60 * 1000, // 120 天的有效期
        httpOnly: true, // 禁止客户端脚本访问 Cookie
        signed: true, // 启用签名
        sameSite: 'strict', // 防止跨站点请求伪造攻击
        secure: process.env.NODE_ENV === 'production', // 仅在 HTTPS 连接中使用 Cookie
    };
    let session_id = cryptoUtilsHelper.encrypt(req.body.body.email);
    res.cookie('session_id', session_id, cookieOptions);

    console.log('session_id = '+session_id)
    checkAuthCookieArray.checkCookieObjArray.push(session_id);
    var obj = new response();
    obj.code = 1;
    obj.msg = "ok";
    return res.send(JSON.stringify(obj));
});

app.post('/ecard/orderUpload', checkAuth, function (req, res) {
    var createDate = new Date().getTime();
    var eventtime = dateHelper.getFormatDateByLong(createDate, "yyyy-MM-dd hh:mm:ss");

    const orders = {
        email: req.body.body.orderInfo.email,
        payment_code: req.body.body.orderInfo.purchase_code,
        shipping_address_id: 0,
        order_id: 0
    }
    console.log(orders.email)
    const cards = {
        card_name: req.body.body.cards.card_name,
        company_logo: req.body.body.cards.company_logo,
        small_logo: req.body.body.cards.small_logo,
        card_material_url: req.body.body.cards.card_material_url,
        buy_count: req.body.body.cards.buy_count,
        qr_logo: req.body.body.cards.qr_logo,
        card_id: 0,

    }


    const shipping_address = {
        first_name: req.body.body.shipping_address.first_name,
        last_name: req.body.body.shipping_address.last_name,
        company: req.body.body.shipping_address.company,
        full_address: req.body.body.shipping_address.full_address,
        address_line: req.body.body.shipping_address.address_line,
        city: req.body.body.shipping_address.city,
        country: req.body.body.country,
        state: req.body.body.shipping_address.state,
        zip_code: req.body.body.shipping_address.zip_code,
        phone_number: req.body.body.shipping_address.phone_number,
        email: req.body.body.shipping_address.email,
        vat: req.body.body.shipping_address.vat
    }
    orderDetailUtils.PromiseUtil(cards, orders, shipping_address, function (code, err) {
        console.log("/ecard/orderUpload = code = " + code)
        var obj = new response();
        obj.code = code;
        obj.msg = err;

        return res.send(JSON.stringify(obj));
    });
});

/*
  密码重置:先检测链接的有效性
  resetToken;email
 */
app.post('/ecard/checkTokenTimeOut', function (req, res) {
    var email = req.body.body.email;
    console.log("进来了吗" + email)
    if (email == null) {
        return publicServerError(res, messageModel.email_1);
    } else if (!email.includes("@")) {
        return publicServerError(res, messageModel.email_2);
    }
    var resetToken = req.body.body.resetToken;

    if (resetToken == null) {
        return publicServerError(res, messageModel.email_1);
    } else if (!email.includes("@")) {
        return publicServerError(res, messageModel.email_2);
    }

    loginPasswordResetCheckTimeOutHelper.selected(email, resetToken, function (error, status) {
        if (status == 10) {
            var obj = new response();
            obj.code = 10;
            obj.msg = messageModel.Email_not_exist;
            return res.send(JSON.stringify(obj));
        } else if (status == 11) {
            var obj = new response();
            obj.code = 11;
            obj.msg = messageModel.token_has_expired;
            return res.send(JSON.stringify(obj));
        } else if (status == 1) {
            var obj = new response();
            obj.code = 1;
            obj.msg = "有效";
            return res.send(JSON.stringify(obj));
        } else {
            return publicServerError(res);
        }
    })
});


/*
   作废
 */
app.post('/ecard/confirmPassword', function (req, res) {
    var mail = req.body.body.emailAddress;
    var userPassword = req.body.body.userPassword;
    sendMailHelper.insert(mail, function (error, status) {
        console.log("get('/ecard/sendEmail'" + status)
        if (status == 1) {
            var obj = new response();
            obj.code = 1;
            obj.msg = 'ok';
            return res.send(JSON.stringify(obj));
        } else {
            var obj = new response();
            obj.code = -1;
            obj.msg = "数据库错误";
            return res.send(JSON.stringify(obj));
        }
    });
});

/**
 *
 */
app.post('/ecard/sendPasswordEmail', checkAuth, function (req, res) {
    var mail = req.body.body.email;
    console.log("mail = " + mail.includes("@"))
    if (mail == null) {
        return callBackErrorAlertMessage(res, messageModel.email_1)
    } else if (!mail.includes("@")) {
        return callBackErrorAlertMessage(res, messageModel.email_2)
    }

    sendMailHelper.insert(mail, function (error, status) {
        if (status == 2) {
            var obj = new response();
            obj.code = 1;
            obj.msg = messageModel.Email_not_exist;
            return res.send(JSON.stringify(obj));
        } else if (status == 1) {
            var obj = new response();
            obj.code = 1;
            obj.msg = messageModel.password_rest;
            return res.send(JSON.stringify(obj));
        } else {
            return publicServerError(res)
        }
    });
});
app.post('/ecard/selectCardPersonalInfo', checkAuth, function (req, res) {
    const card_num = req.body.body.card_num;
    personalInfoHelper.selectPersonalInfo(card_num, function (status, err, rows) {
        if (err != null) {
            return publicServerError(res)
        }
        if (status == 1) {
            var obj = new response();
            obj.code = 1;
            obj.msg = "ok";
            obj.body = rows[0];
            return res.end(JSON.stringify(obj));

        } else {
            var obj = new response();
            obj.code = status;
            obj.msg = err;
            return res.end(JSON.stringify(obj));
        }

    })
});

app.post('/ecard/addCardPersonalInfo', checkAuth, function (req, res) {
    const personal = {
        card_num: req.body.body.card_num,
        photo_url: req.body.body.photo_url,
        nick_name: req.body.body.nick_name,
        first_name: req.body.body.first_name,
        last_name: req.body.body.last_name,
        company: req.body.body.company,
        role: req.body.body.role,
        job_title: req.body.body.job_title,
        phone: req.body.body.phone,
        email: req.body.body.email,
        url: req.body.body.url,
        address: req.body.body.address,
        social_profile: req.body.body.social_profile,
        instant_message: req.body.body.instant_message,
        birthday: req.body.body.birthday,
        date: req.body.body.date,
        card_num: req.body.body.card_num
    }

    personalInfoHelper.addPersonalInfo(personal, function (status, err, rows) {
        var obj = new response();
        obj.code = status;
        obj.msg = "";
        return res.end(JSON.stringify(obj));
    })
});


/**
 * NFC 扫码尽量，如果用户在已经注册过并且卡有信息,返回卡信息
 *             如果用户在已经注册过并且没有卡信息,返回卡信息
 */
app.get('/ecard/nfc', function (req, res) {
    console.log('/ecard/nfc');
    const userId = req.body.body.email;
    console.log(userId);
    const cardId = req.body.body.card_num;
    console.log(cardId);

    var nfcStatusCode = 0;
    var msg;
    nfcHelper.selectRegister(userId, cardId, function (status, callRow, error, message) {

        console.log('nfcHelper.selectRegister = ' + message)
        if (error != null) {
            return publicServerError(res);
        }
        if (status == 7) {
            //卡号无效，联系客服
            nfcStatusCode = 7;
            msg = messageModel.invalid_card;
        } else if (status == 8) {
            //没有注册
            nfcStatusCode = messageModel.NFC_no_register_code;
            msg = messageModel.NFC_no_register;
        } else if (status == 9) {
            nfcStatusCode = messageModel.NFC_empty_card_code;
            msg = messageModel.NFC_empty_card;
            const cookieOptions = {
                maxAge: 120 * 24 * 60 * 60 * 1000, // 120 天的有效期
                httpOnly: true, // 禁止客户端脚本访问 Cookie
                signed: true, // 启用签名
                sameSite: 'strict', // 防止跨站点请求伪造攻击
                secure: process.env.NODE_ENV === 'production', // 仅在 HTTPS 连接中使用 Cookie
            };
            let session_id = cryptoUtilsHelper.encrypt(userId);
            res.cookie('session_id', session_id, cookieOptions);
            checkAuth.checkCookieObjArray.push(session_id);
        } else if (status == 10) {
            nfcStatusCode = messageModel.NFC_display_card;
            msg = messageModel.NFC_display_card_code;
            const cookieOptions = {
                maxAge: 120 * 24 * 60 * 60 * 1000, // 120 天的有效期
                httpOnly: true, // 禁止客户端脚本访问 Cookie
                signed: true, // 启用签名
                sameSite: 'strict', // 防止跨站点请求伪造攻击
                secure: process.env.NODE_ENV === 'production', // 仅在 HTTPS 连接中使用 Cookie
            };
            let session_id = cryptoUtilsHelper.encrypt(userId);
            res.cookie('session_id', session_id, cookieOptions);
            checkAuth.checkCookieObjArray.push(session_id);
        }
        var obj = new response();
        obj.code = nfcStatusCode;
        obj.msg = msg;
        return res.end(JSON.stringify(obj));
    });

});


function toJSON(data, message, code) {
    return JSON.stringify(data, message, code);
}

var port = normalizePort(process.env.PORT_S || '30007');
http.createServer(app).listen(port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
