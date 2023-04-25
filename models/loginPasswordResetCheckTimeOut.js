var db = require('./dbhelper');
const crypto = require('crypto');
const dateUtils = require('./dateUtils');

function loginPasswordResetCheckTimeOut() {
}

module.exports = loginPasswordResetCheckTimeOut;

// 生成重置密码 token
function generateResetToken() {
    const buffer = crypto.randomBytes(20);
    return buffer.toString('hex');
}

loginPasswordResetCheckTimeOut.insertEmailAndToken = function (email, callback) {
    console.log('重置密码 token 储到数据库中');
// 生成重置密码 token 和过期时间
    const resetToken = generateResetToken();
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000); // 过期时间为当前时间后一小时
    console.log('重置密码 token 储到数据库中' + expirationTime.getTime());
    // 将重置密码 token 和过期时间存储到数据库中
    const insertSql = "INSERT INTO reset_tokens SET email='" + email + "' ,token='" + resetToken + "', expiration_time='" + expirationTime.getTime() + "';";
    db.query(
        insertSql,
        function (err, results) {
            console.log('重置密码 token 已存储到数据库中');
            if (err) {
                console.log(err);
                callback(null, -1);
            } else {
                console.log('重置密码 token 已存储到数据库中');
                // 发送重置密码邮件
                callback(null, 1);
            }
        }
    );
}

loginPasswordResetCheckTimeOut.selected = function (email, s_resetToken, callback) {
// 生成重置密码 token 和过期时间
    db.query(
        "SELECT token, expiration_time FROM reset_tokens WHERE email = '" + email + "' ORDER BY id DESC LIMIT 1",
        function (err, results) {

            if (results.length == 0) {
                // 未找到该邮箱的重置密码 token，认为 token 失效
                callback(null, 10)
            } else {
                const d_token = results[0].token;
                const d_expirationTime = results[0].expiration_time;

                const d_time = dateUtils.getFormatDateByLong(d_expirationTime);
                var s_time = new Date().getTime();
                const str_time = dateUtils.getFormatDateByLong(s_time);
                console.log("d_time = " + d_time + "  s_time= " + str_time);
                console.log("d_time = " + d_expirationTime + "  s_time= " + s_time);

                console.log("d_token = " + d_token + "  s_resetToken= " + s_resetToken);

                console.log(d_token != s_resetToken);
                console.log(d_expirationTime < s_time);

                if (d_token != s_resetToken || d_expirationTime < s_time) {
                    // 重置密码 token 不匹配或已过期，认为 token 失效
                    console.log("-----11----");
                    callback(null, 11)
                } else {
                    console.log("-----1----");
                    callback(null, 1)
                }
            }
        }
    );

}

