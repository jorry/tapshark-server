    /**
 * Created by iqianjin-liujiawei on 16/11/1.
 */

var db = require('./dbhelper');

function nfcLinkHelper() {
}
module.exports = nfcLinkHelper;


nfcLinkHelper.selectRegister = function (userid,cardId,callback) {
//status  = -1  没有注册;
    console.log('select selectRegister');
    var manager_add_user =  "select * from manager_add_user where userId = '" + userid + "';";
    db.query(manager_add_user, function (err, rows, fields) {
        console.log(err);
        if (err) {
            return callback(0,rows,err,"数据库错误");
        } //用户卡号没有在系统中存在
        if (rows.length == 0){
            return callback(7,rows,err,"用户id没有在管理系统找到");
        }
        var userEmail = rows[0].email;
        //根据用email 去查询注册表
        var ecard_user_register = "select * from ecard_user_register where email = '" + userEmail + "';";
        db.query(ecard_user_register, function (err, rows, fields) {
            console.log(err);
            if (err) {
                return callback(-1,rows,err,"数据库错误");
            }
            if (rows.length == 0){ //没有注册，去注册
                return callback(8,rows,err,"用户id没有在注册表找到");
            }
            console.log("select * from user_card_info where cardId = '"+cardId+"' and user_id = '"+userid+"';")
            db.query("select * from user_card_info where cardId = '"+cardId+"' and user_id = '"+userid+"';", function (err, rows, fields) {
                console.log(err);
                if (err) {
                    return callback(-1,rows,err,"数据库错误");
                }
                if (rows.length == 0){
                    return callback(9,rows,err,"用户Id 和卡信息 没有找到 ，去新增页面");
                }else {
                    return callback(10,rows,err,"用户Id 和卡信息 找到用户信息 ，展示页面");
                }
            });
        });
    });
};