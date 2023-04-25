    /**
 * Created by iqianjin-liujiawei on 16/11/1.
 */

var db = require('./dbhelper');

function httpStatusHelper() {
}
module.exports = httpStatusHelper;

httpStatusHelper.insertRecord = function (callback) {
    var sql = "INSERT INTO ecard_user_login SET username='ljw5' ,password='123123', email='12@gmail.com', created_at='2012-1-1';";
    console.log('insertRecord ecard_user_login')
    db.query(sql, function (err, rows, fields) {
        console.log(err);
        if (err) {
            return callback(err);
        }
        console.log('添加成功')
        callback();
    });
};