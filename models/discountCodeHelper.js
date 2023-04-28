    /**
 * Created by iqianjin-liujiawei on 16/11/1.
 */

var db = require('./dbhelper');
var messageModel = require('../config/message');
function discountCodeHelper() {
}
module.exports = discountCodeHelper;

discountCodeHelper.selectPersonalInfo = function (email,discountCode,callback) {
//status  = -1  没有注册;
    console.log('select discountCheck');
    var manager_add_user =  "select * from discountCode where email = '" + email + "' and discountCode = '"+discountCode+"';";
    db.query(manager_add_user, function (err, rows, fields) {
        console.log(err);
        if (err) {
            return callback(0,rows,err,messageModel.public_server_error);
        } //用户卡号没有在系统中存在
        if (rows.length == 0){
            return callback(2,err,messageModel.Invalid_discount_code);
        }else{
            return callback(1,err,"找到折扣码,折扣码有效");
        }
    });
};