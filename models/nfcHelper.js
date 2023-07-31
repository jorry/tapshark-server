    /**
 * Created by iqianjin-liujiawei on 16/11/1.
 */

var db = require('./dbhelper');
var messageModel = require('../config/message');
function nfcLinkHelper() {
}
module.exports = nfcLinkHelper;


nfcLinkHelper.selectRegister = function (email,card_num,callback) {
//status  = -1  没有注册;
    
    var manager_add_user =  "select * from discountCode where email = '" + email + "';";
    console.log(manager_add_user);
    db.query(manager_add_user, function (err, rows, fields) {
        console.log(err);
        if (err) {
            return callback(0,rows,err,messageModel.db_error);
        } //用户卡号没有在系统中存在
        if (rows.length == 0){
            return callback(7,rows,err,messageModel.id_no_find);
        }
        var userEmail = rows[0].email;
        //根据用email 去查询注册表
        var ecard_user_register = "select * from ecard_user_register where email = '" + userEmail + "';";
        db.query(ecard_user_register, function (err, rows, fields) {
            console.log(err);
            if (err) {
                return callback(-1,rows,err,messageModel.db_error);
            }
            if (rows.length == 0){ //没有注册，去注册
                return callback(8,rows,err,messageModel.id_no_find);
            }
            console.log("select * from personal_info where card_num = '"+card_num+"';")
            db.query("select * from personal_info where card_num = '"+card_num+"';", function (err, rows, fields) {
                console.log(err);
                if (err) {
                    return callback(-1,rows,err,messageModel.db_error);
                }
                if (rows.length == 0){
                    return callback(9,rows,err,messageModel.id_no_find);
                }else {
                    return callback(10,rows,err,'ok');
                }
            });
        });
    });
};