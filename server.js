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
const { v4: uuidv4 } = require('uuid');
var cardmanagerHelper = require('./models/cardmanagerHelper');

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
app.use(cors({
      credentials: true
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://tapshark.co'); // 替换为允许的客户端域名
    res.header('Access-Control-Allow-Credentials', 'true'); // 允许携带凭据
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // 允许的请求方法
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // 允许的请求头
    next();
  });
const sessionId = crypto.randomBytes(16).toString('hex');
app.use(cookieParser(sessionId));

//发邮件方法，参数：channel：渠道iOS或android ,subject邮件标题, html邮件内容

var response = function () {
    this.code;
    this.msg;
    this.body;
};

function saveCookie(res,req,email){
  const cookieOptions = {
        maxAge: 120 * 24 * 60 * 60 * 1000, // 120 天的有效期
        httpOnly: false, // 禁止客户端脚本访问 Cookie
        signed: false, // 启用签名
        sameSite: 'strict', // 防止跨站点请求伪造攻击
        secure: process.env.NODE_ENV === 'production', // 仅在 HTTPS 连接中使用 Cookie
    };
    let session_id = cryptoUtilsHelper.encrypt(email);
console.log("save-session_id = "+session_id);
    res.cookie('session_id', session_id, cookieOptions);
    checkAuthCookieArray.checkCookieObjArray.push(session_id);
}


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

app.post('/getC', function (req, res) {

    var obj = new response();
    obj.code = 1;
    obj.msg = req.cookies.session_id;
    return res.end(JSON.stringify(obj));
});


app.post('/saveC', function (req, res) {
    var email = "156224301.com";

    const cookieOptions = {
        maxAge: 120 * 24 * 60 * 60 * 1000, // 120 天的有效期
        httpOnly: false, // 禁止客户端脚本访问 Cookie
        signed: false, // 启用签名
        //sameSite: 'strict', // 防止跨站点请求伪造攻击
       // secure: process.env.NODE_ENV === 'production', // 仅在 HTTPS 连接中使用 Cookie
    };
    let session_id = cryptoUtilsHelper.encrypt(email);

    res.cookie('session_id', session_id, cookieOptions);
    checkAuthCookieArray.checkCookieObjArray.push(session_id);
    var obj = new response();
    obj.code = 1;
    obj.msg = req.cookies.session_id;
    return res.end(JSON.stringify(obj));
});


app.post('/testPost', function (req, res) {
    var obj = new response();
    obj.code = 100;
    obj.msg = "ok";
    return res.end(JSON.stringify(obj));
});


app.post('/ecard/userLogin', function (req, res) {
    console.log("abc-------abc---login");
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
            saveCookie(res,req,email)
//            checkAuthCookieArray.checkCookieObjArray.push(session_id);
        }
        var obj = new response();
	        obj.code = status;;
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
        const cookieOptions = {
            maxAge: 120 * 24 * 60 * 60 * 1000, // 120 天的有效期
            httpOnly: false, // 禁止客户端脚本访问 Cookie
            signed: false, // 启用签名
            sameSite: 'strict', // 防止跨站点请求伪造攻击
            secure: process.env.NODE_ENV === 'production', // 仅在 HTTPS 连接中使用 Cookie
        };
        let session_id = cryptoUtilsHelper.encrypt(email);
        res.cookie('session_id', session_id, cookieOptions);
        checkAuthCookieArray.checkCookieObjArray.push(session_id);
        obj.code = status;
        obj.msg = messageModel.register_call_back_4 + session_id;
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
 * 这个接口好像没啥用
 */
app.post('/ecard/checkDiscountCode',function (req, res) {
    var email = req.body.email;
    var discountCode = req.body.purchase_code;
    discountHelper.checkDiscountCode(email, discountCode, function (status, error, message) {
        if (error) {
            return publicServerError(res);
        }
        var obj = new response();
        obj.code = status;
        obj.buyCount = message;
        obj.msg = message;
        return res.end(JSON.stringify(obj));
    });
});

app.get('/abc', function (req, res) {
    console.log("app.get('/'")
    printCookie(req);
    res.send();
});

function printCookie(req){
    const cookieValue = req.cookies.session_id;
    	console.log('---------printCookie-------------',cookieValue);
//	console.log('print cookie = '+cryptoUtilsHelper.decryptCookie(cookieValue));
}
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
        httpOnly: false, // 禁止客户端脚本访问 Cookie
        signed: false, // 启用签名
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
app.post('/ecard/sendPasswordEmail', function (req, res) {
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

//----------以下接口要增加：checkAuth
app.post("/ecard/upload/img", function (req, res) {
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

        let rootPath = path.resolve(__dirname, '../../'); //代码文件的根路径
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

app.post('/addUserOrder', checkAuth,function (req, res) {
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



/**
 * 用户主卡页
 */
app.post('/ecard/userMainCardPage',checkAuth, function (req, res) {
    var email = req.body.body.email;
	printCookie(req);
   const sessionId = req.body.body.session_id;  
console.log('------email='+email+'  sessionId = '+sessionId);
    mainCard.selectUserCard(email, function (status, rows) {
        if (status == -1) {
            return publicServerError(res);
        }
        const list = rows.map(row => {
            console.log('----------'+row.user_name);
            return {
                
                company_logo: row.company_logo,
                user_name: row.user_name,
                user_logo: row.user_logo,
                card_material_url: row.card_material_url,
                card_num: row.card_num,
            };
        });
        var obj = new response();
        obj.code = 1;
        obj.msg = "ok";
        obj.body = list;
        return res.end(JSON.stringify(obj));
    });
});

app.get('/ecard/testOrder',function(req,res){

    orderDetailUtils.updateCount('840601413@qq.com','7DAE-0E8C-4834-4645-8C05-CE14-8651-506F',1,function(){
        var obj = new response();
        obj.code = 1;
        obj.msg = "ok";
        return res.end(JSON.stringify(obj));
    });
    
})

app.post('/ecard/orderUpload',function (req, res) {
    
    var createDate = new Date().getTime();
    var eventtime = dateHelper.getFormatDateByLong(createDate, "yyyy-MM-dd hh:mm:ss");
    const cookieValue = req.body.body.session_id;
    console.log('cookieValue =  ?'+cookieValue);
    console.log('读取:session_id = '+cookieValue);
    const orders = {
        email: cryptoUtilsHelper.decryptCookie(cookieValue), 
        payment_code: req.body.body.orderInfo.purchase_code,
        shipping_address_id: 0,
        creatTime:eventtime,
        order_id: 0
    }
    console.log('font_color = '+req.body.body.cards.font_color)
    const cards = {
        card_name: req.body.body.cards.card_name,
        company_logo: req.body.body.cards.company_logo,
        small_logo: req.body.body.cards.small_logo,
        card_material_url: req.body.body.cards.card_material_url,
        buy_count: req.body.body.cards.buy_count,
        qr_logo: req.body.body.cards.qr_logo,
        font_color : req.body.body.cards.font_color,
        creatTime:eventtime,
        email: cryptoUtilsHelper.decryptCookie(cookieValue),
        card_id: 0,

    }

    console.log('req.body.body.country',req.body.body.shipping_address.country);
    const shipping_address = {
        first_name: req.body.body.shipping_address.first_name,
        last_name: req.body.body.shipping_address.last_name,
        company: req.body.body.shipping_address.company,
        full_address: req.body.body.shipping_address.full_address,
        address_line: req.body.body.shipping_address.address_line,
        city: req.body.body.shipping_address.city,
        country: req.body.body.shipping_address.country,
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
app.post('/ecard/selectCardPersonalInfo',checkAuth, function (req, res) {
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

app.post('/ecard/updateCardPersonalInfo',checkAuth, function (req, res) {
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
        theme: req.body.body.theme,
        date: req.body.body.date
    }

    for (const key in personal) {
        if (personal[key] === undefined) {
            personal[key] = '';
            console.log('----------无-------')
        }else{
            console.log('-----------有------'+personal[key])
        }
      }

    personalInfoHelper.updatePersonalInfo(personal, function (status, err, rows) {
        var obj = new response();
        obj.code = status;
        obj.msg = "";
        return res.end(JSON.stringify(obj));
    })
});


app.post('/ecard/addCardPersonalInfo',checkAuth, function (req, res) {
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
        theme: req.body.body.theme,
        date: req.body.body.date
    }

   for (const key in personal) {
        if (personal[key] === undefined) {
            personal[key] = '';
            console.log('----------无-------')
        }else{
            console.log('-----------有------'+personal[key])
        }
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
app.post('/ecard/nfc', function (req, res) {
    console.log('/ecard/nfc');
   const userId = req.body.body.userId; 
		//cryptoUtilsHelper.decryptCookie(req.body.body.userId);
    //console.log(userId);
    const card_num = req.body.body.card_num;
		//cryptoUtilsHelper.decryptCookie(req.body.body.card_num);
   // console.log(card_num);
   // const userId = req.body.body.userId;
   // console.log(userId);
   // const card_num = req.body.body.card_num;
   // console.log(card_num);
  // const userId =  cryptoUtilsHelper.decryptCookie(req.body.body.userId);
    //console.log(userId);
    //const card_num = cryptoUtilsHelper.decryptCookie(''+req.body.body.card_num);
    //console.log(card_num);

    var nfcStatusCode = 0;
    var msg;
    nfcHelper.selectRegister(userId, card_num, function (status, callRow, error, message) {

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
           // nfcStatusCode = messageModel.NFC_empty_card_code;
           // msg = messageModel.NFC_empty_card;
           // const cookieOptions = {
          //      maxAge: 120 * 24 * 60 * 60 * 1000, // 120 天的有效期
          //      httpOnly: true, // 禁止客户端脚本访问 Cookie
           //     signed: true, // 启用签名
           //     sameSite: 'strict', // 防止跨站点请求伪造攻击
           //     secure: process.env.NODE_ENV === 'production', // 仅在 HTTPS 连接中使用 Cookie
           // };
           // let session_id = cryptoUtilsHelper.encrypt(userId);
           // res.cookie('session_id', session_id, cookieOptions);
           // checkAuthCookieArray.checkCookieObjArray.push(session_id);
        saveCookie(res,req,userId);
	} else if (status == 10) {
            nfcStatusCode = messageModel.NFC_display_card_code;
            msg =  messageModel.NFC_display_card;
           // const cookieOptions = {
             //   maxAge: 120 * 24 * 60 * 60 * 1000, // 120 天的有效期
               // httpOnly: true, // 禁止客户端脚本访问 Cookie
                //signed: true, // 启用签名
                //sameSite: 'strict', // 防止跨站点请求伪造攻击
                //secure: process.env.NODE_ENV === 'production', // 仅在 HTTPS 连接中使用 Cookie
           // };
           // let session_id = cryptoUtilsHelper.encrypt(userId);
           // res.cookie('session_id', session_id, cookieOptions);
           // checkAuthCookieArray.checkCookieObjArray.push(session_id);
        
		 saveCookie(res,req,userId);
	}
	    console.log('NFC 返回的数据是'+JSON.stringify(obj));
        var obj = new response();
        obj.code = nfcStatusCode;
        obj.msg = msg;
        return res.end(JSON.stringify(obj));
    });

});

//------管理后台
app.get('/cardManager/cards', function (req, res) {
    cardmanagerHelper.selectCards(function(status,rows){
        var obj = new response();
        obj.code = status;
        obj.body = rows;
        return res.end(JSON.stringify(obj));
    })
});

function generateUniqueString() {
    const uuid = uuidv4().toUpperCase();
    const formattedString = uuid.replace(/-/g, '').replace(/(.{4})/g, '$1-').slice(0, -1);
    return formattedString;
  }

app.post('/cardmanager/createRechargeCode', function (req, res) {
    const v = generateUniqueString();
    var createDate = new Date().getTime();
    var eventtime = dateHelper.getFormatDateByLong(createDate, "yyyy-MM-dd hh:mm:ss");
    const chargeModel = {
        email: req.body.email,
        payMonney: req.body.payMonney,
        buyCount: req.body.region,
        discountCode:v,
        createTime:eventtime
    };

    discountHelper.createRechargeCode(chargeModel,function(status,error){
        var obj = new response();
        obj.code = status;
        if(status === 20000){
            obj.body = chargeModel.discountCode;
        }
        return res.end(JSON.stringify(obj));
    })
});

app.get('/cardmanager/getCreateCardList/list', function (req, res) {
    orderDetailUtils.cardmanagerSelect(function(status,rows){
        var obj = new response();
        obj.code = status;
        obj.body = rows;
        return res.end(JSON.stringify(obj));
    })
});

app.get('/cardmanager/rechargeCode/list', function (req, res) {
    discountHelper.selectAllCount(function(status,rows){
        var obj = new response();
        obj.code = status;
        obj.body = rows;
        return res.end(JSON.stringify(obj));
    })
});

app.post('/cardmanager/getCardDetailByOrderId', function (req, res) {

    var orderId = req.body.orderId;


    orderDetailUtils.getCardDetailByOrderId(orderId,function(status,rows){
        var obj = new response();
        obj.code = status;
        obj.count = rows.length;
        obj.body = rows;
        obj.cardLink = createCardLink(rows);
        return res.end(JSON.stringify(obj));
    })
});

function createCardLink(rows){
    const cardLinks = [];
    for (let i = 0; i < rows.length; i++){
        let link = 'http://tapshark.co/tapShark/nfcChecked.html?'+'userId='+rows[i].email+'cardNum='+rows[i].card_num;
        cardLinks.push({link});
    }
    return cardLinks;
}

function toJSON(data, message, code) {
    return JSON.stringify(data, message, code);
}

var port = normalizePort(process.env.PORT_S || '3001');
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
