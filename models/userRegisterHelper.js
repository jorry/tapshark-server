    /**
 * Created by iqianjin-liujiawei on 16/11/1.
 */

var db = require('./dbhelper');

function userRegister() {
}
module.exports = userRegister;

userRegister.register = function (username,password,email,created_at,last_login,callback) {
//status  = -1  没有注册;
    console.log('select discountCheck');
    var sql = "INSERT INTO ecard_user_register SET username='"+username+"' ,password='"+password+"', email='"+email+"', created_at='"+created_at+"',last_login='"+last_login+"';";
    db.query(sql, function (err, rows, fields) {
        if (err) {
            if (err.errno == 1062){
                return callback(2,err);
            }
            return callback(0,err);
        }
        return callback(1,err);
    });
};