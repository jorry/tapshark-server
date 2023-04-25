/**
 * Created by iqianjin-liujiawei on 16/11/1.
 */

var db = require('./dbhelper');
const dateHelper = require("./dateUtils");

function loginHelper() {
}

module.exports = loginHelper;

loginHelper.insertRecord = function (email, password, callback) {
    var selectRegister = "select * from ecard_user_register where email = '" + email + "' and password = '" + password + "';";
    console.log(selectRegister)
    db.query(selectRegister, function (err, rows, fields) {
        console.log("err = " + err);
        if (err) {
            return callback(-1, err);
        }
        if (rows.length == 0) {
            callback(0, err);
        } else {
            var createDate = new Date().getTime();
            var eventtime = dateHelper.getFormatDateByLong(createDate, "yyyy-MM-dd hh:mm:ss");
            var loginInsert = "INSERT INTO ecard_user_login SET username='" + email + "' ,password='" + password + "', email='" + email + "', created_at='" + eventtime + "';";
            console.log(loginInsert);

            db.query(loginInsert, function (err, rows, fields) {
                console.log(err);
                if (err) {
                    return callback(-1, err);
                }
                console.log('添加成功')
                callback(1, err);
            });
        }

    });

};


loginHelper.updatePassword = function (email, new_password, callback) {

    var checkEmal = "select * from ecard_user_register where email = '" + email + "';";
    db.query(checkEmal, function (err, rows, fields) {
        if (err) {
            return callback(-1, err);
        }
        if (rows.length == 0) {
            return callback(0, err);
        } else {
            var selectRegister = "UPDATE ecard_user_register    SET password = '" + new_password + "'    WHERE email = '" + email + "';";
            console.log(selectRegister)
            db.query(selectRegister, function (err, rows, fields) {
                console.log("err = " + err);
                if (err) {
                    return callback(-1, err);
                }
                return callback(1, err);
            });
        }
    });

};