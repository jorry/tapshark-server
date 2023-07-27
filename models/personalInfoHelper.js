/**
 * Created by iqianjin-liujiawei on 16/11/1.
 */

let db = require('./dbhelper');
let messageModel = require('../config/message');
const e = require("express");

function personalInfoHelper() {
}

module.exports = personalInfoHelper;

personalInfoHelper.selectPersonalInfo = function (card_num, callback) {
//status  = -1  没有注册;
    console.log('select discountCheck');
    const personal_info = "select * from personal_info where card_num = '" + card_num + "';";
    db.query(personal_info, function (err, rows, fields) {
        console.log(err);
        if (err) {
            return callback(-1, err,rows);
        } //用户卡号没有在系统中存在
        if (rows.length == 0) {
            return callback(0, err,rows);
        } else {
            return callback(1, err,rows);
        }
    });
};

personalInfoHelper.updatePersonalInfo = function (personalObj, callback) {
    //status  = -1  没有注册;
        console.log('update personal_info');
        const insertSql = "update personal_info SET photo_url='" + personalObj.photo_url + 
        "' ,nick_name='" + personalObj.nick_name +
         "', first_name='" + personalObj.first_name+ "'" +
         ", last_name='"+personalObj.last_name+
         "',company='"+personalObj.company+
         "',role='"+personalObj.role+
         "',job_title='"+personalObj.job_title+
         "',phone='"+personalObj.phone+"'," +
            "email='"+personalObj.email+
            "',address='"+personalObj.address+
            "',birthday='"+personalObj.birthday+
            "',date='"+personalObj.date+
            "',social_profile='"+personalObj.social_profile+
            "',instant_message='"+personalObj.instant_message+"'" +
            ",url='"+personalObj.url+
            "',theme='"+personalObj.theme+"' where card_num = '"+personalObj.card_num+"';";
    
        db.query(insertSql, function (err, rows, fields) {
            console.log(err);
            if (err) {
                return callback(-1, err);
            } //用户卡号没有在系统中存在
            if (rows.length == 0) {
                return callback(0, err);
            } else {
                return callback(1, err);
            }
        });
    };

personalInfoHelper.addPersonalInfo = function (personalObj, callback) {
//status  = -1  没有注册;
    console.log('select insertSql_personal_info');
    const insertSql = "INSERT INTO personal_info SET photo_url='" + personalObj.photo_url + 
    "' ,nick_name='" + personalObj.nick_name +
     "', first_name='" + personalObj.first_name+ "'" +
     ", last_name='"+personalObj.last_name+
     "',company='"+personalObj.company+
     "',role='"+personalObj.role+
     "',job_title='"+personalObj.job_title+
     "',phone='"+personalObj.phone+"'," +
        "email='"+personalObj.email+
        "',address='"+personalObj.address+
        "',birthday='"+personalObj.birthday+
        "',date='"+personalObj.date+
        "',social_profile='"+personalObj.social_profile+
        "',instant_message='"+personalObj.instant_message+"'" +
        ",card_num='"+personalObj.card_num+"'" +
        ",url='"+personalObj.url+
        "',theme='"+personalObj.theme+"';";

    db.query(insertSql, function (err, rows, fields) {
        console.log(err);
        if (err) {
            return callback(-1, err);
        } //用户卡号没有在系统中存在
        if (rows.length == 0) {
            return callback(0, err);
        } else {
            return callback(1, err);
        }
    });
};
