    /**
 * Created by iqianjin-liujiawei on 16/11/1.
 */

var db = require('./dbhelper');
var messageModel = require('../config/message');
function discountCodeHelper() {
}
module.exports = discountCodeHelper;

discountCodeHelper.createRechargeCode = function(codeModel,callback){
    var loginInsert = "INSERT INTO discountCode SET email='" + codeModel.email + "' ,discountCode='" + codeModel.discountCode + "', buyCount='" + codeModel.buyCount + "', status='" + 0 + "', createTime='" + codeModel.createTime + "',payMonney = '"+codeModel.payMonney+"';";
    db.query(loginInsert,function(err,rows,fields){
        if (err) {
            return callback(0,err);
        } //用户卡号没有在系统中存在
        return callback(20000,"");
    })
};
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


discountCodeHelper.checkDiscountCode = function (email,discountCode,callback) {
    //status  = -1  没有注册;
        console.log('select discountCheck');
        var manager_add_user =  "select * from discountCode where email = '" + email + "' and discountCode = '"+discountCode+"';";
        db.query(manager_add_user, function (err, rows, fields) {
            console.log(err);
            if (err) {
                return callback(-1,rows,err,messageModel.public_server_error);
            } //用户卡号没有在系统中存在
            if (rows.length == 0){
                return callback(0,err,messageModel.Invalid_discount_code);
            }else{
                console.log('buyCount-------> = '+rows[0].buyCount);
                if(rows[0].buyCount > 0){
                    console.log('buyCount-------> = ok');
                    return callback(1,err,rows[0].buyCount);
                }else{
                    cconsole.log('buyCount-------> = rows[0].buyCount == 0');
                    return callback(0,err,messageModel.buyRechargeCodeIsHave);
                }
            }
        });
    };

discountCodeHelper.selectAllCount = function (callback) {
    //status  = -1  没有注册;
        console.log('select discountCheck');
        var manager_add_user =  "select * from discountCode;";
        db.query(manager_add_user, function (err, rows, fields) {
            console.log(err);
            if (err) {
                return callback(0,rows,err,messageModel.public_server_error);
            } //用户卡号没有在系统中存在
            if (rows.length == 0){
                return callback(2,err);
            }else{
                return callback(1,rows);
            }
        });
    };
