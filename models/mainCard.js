/**
 * Created by iqianjin-liujiawei on 16/11/1.
 */

var db = require('./dbhelper');

function mainCardHelper() {
}

module.exports = mainCardHelper;

mainCardHelper.selectUserCard = function (email, callback) {
    var selectRegister = "SELECT c.* FROM order_cards oc JOIN cards c ON oc.card_id = c.card_id JOIN orders o ON oc.order_id = o.order_id WHERE o.email = '"+email+"';";
    console.log(selectRegister)
    db.query(selectRegister, function (err, rows, fields) {
        console.log("err = "+err);
        if (err) {
            return callback(-1, err);
        }
        callback(1,rows);
    });
};