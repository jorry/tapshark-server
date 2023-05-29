/**
 * Created by iqianjin-liujiawei on 16/11/1.
 */

var db = require('./dbhelper');
const dateHelper = require("./dateUtils");

function cardmanagerHelper() {
}

module.exports = cardmanagerHelper;


cardmanagerHelper.selectCards = function (callback) {

    var checkEmal = "select * from cards;";
    db.query(checkEmal, function (err, rows, fields) {
        if (err) {
            return callback(-1, err);
        }
        if (rows.length == 0) {
            return callback(0, err);
        } else {
            return callback(20000, rows);
        }
    });
};
