/**
 * Created by iqianjin-liujiawei on 17/5/3.
 */
/**
 * Created by simon on 2016/4/22.
 */
const crypto = require('crypto');

const secret = 'deda7d6de2e9b3831b018795911e58f3';

/*
解密
 */
cryptoHeler. decryptCookie = function (cookieValue) {
    const decipher = crypto.createDecipher('aes-256-cbc', secret);
    let decrypted = decipher.update(cookieValue, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted.toString();
}
/*
加密
 */
cryptoHeler.encrypt = function (data) {
    const cipher = crypto.createCipher('aes-256-cbc', secret);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
function cryptoHeler() {

}

module.exports = cryptoHeler;
