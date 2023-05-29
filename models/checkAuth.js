/**
 * Created by iqianjin-liujiawei on 17/5/3.
 */
/**
 * Created by simon on 2016/4/22.
 */
var cryptoUtilsHelper = require('./cryptoUtils');

var loginHelper = require('./loginHelper');

var checkCookieObjArrayHelper = require('./checkAuthCookieArray');

//   console.log("check = "+checkAuthCookieArray.checkCookieObjArray.find(obj => obj === "adc"));

var response = function () {
    this.code;
    this.msg;
    this.body;
};
function callBackErrorAlertMessage(res,msg) {
    var obj = new response();
    obj.code = 401;
    obj.msg = msg;
    return res.end(JSON.stringify(obj));
}


// 中间件函数
const checkAuth = (req, res, next) => {
    const sessionId = req.body.body.session_id;
    console.log('认证:先检测cookie'+sessionId)

    if (!sessionId) {
        // 如果session_id不存在，返回401状态码
        callBackErrorAlertMessage(res,'please login first');
        return;
    }
    const cookieData = cryptoUtilsHelper.decryptCookie(sessionId);
    console.log('认证:解析后'+cookieData)
    // 如果session_id存在，尝试解密cookie
    if (!cookieData) {
        // 如果cookie无效，返回401状态码
        callBackErrorAlertMessage(res,'please login first');
        return;
    }

    console.log("cookieData" + cookieData);
    console.log('find.......'+(checkCookieObjArrayHelper.checkCookieObjArray.includes(sessionId)))
    if (checkCookieObjArrayHelper.checkCookieObjArray.includes(sessionId)) {
        //如果找到cookie，不用查数据库，直接返回
        console.log("认证:在缓存中找到了cookie")
        req.userData = cookieData;
        next();
    } else {
        loginHelper.checkEmail(sessionId,function(status,error){
            console.log('checkAuth 56行'+status)
            if(status == 1){
                checkCookieObjArrayHelper.checkCookieObjArray.push(sessionId)
                next();
            }else{
                callBackErrorAlertMessage(res,'please login first');
            }
        })
        
    }
};

// 导出中间件函数
module.exports = checkAuth;

