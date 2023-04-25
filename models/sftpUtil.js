// /**
//  * Created by iqianjin-liujiawei on 17/2/8.
//  */
//
// var sftpServer = require('../config/sftpConfig');
// // var multer = require('multer'); //引入multer模块
// var fs = require("fs");        //文件
// // var Client = require('ssh2-sftp-client');
// // var shelljs = require('shelljs');
//
// //var NodeRSA = require('node-rsa');
//
//
// // var sftp = new Client();
//
// //生成一个文件,但是没有后缀
// var uploadFolder = process.cwd() + "/public/uploads";
//
//
// //指定apk名字
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         shelljs.echo('保存的本地路径 /public/uploads  is =  '+uploadFolder);
//         cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
//     },
//     filename: function (req, file, cb) {
//         // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
//         shelljs.echo('storage---' + file.originalname);
//         shelljs.echo('storage---' + file.fieldname);
//
//         cb(null, file.originalname);
//     }
// });
//
// var appendStrem = function (file, md5, callback) {
//     fs.readFile(file.path,function (err,data) {
//         if (err) throw err;
//         const bufMd5 = Buffer.from(md5);
//         let totalLength = bufMd5.length + data.length;
//         const bufRes = Buffer.concat([data,bufMd5], totalLength);
//         fs.writeFile(file.destination+'/'+file.filename, bufRes, (err) => {
//             if (err) throw err;
//         typeof callback === 'function' && callback.call(this,'_'+file.filename)
//     });
//     })
// }
//
// var rsa = function(message){
//     console.log("加密前数据: "+message);
//
//     //var key = new NodeRSA();
//     //
//     //let pKey = '-----BEGIN PUBLIC KEY-----\n'+
//     //'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDafbgu6kK5Ju8VGjyhZqlFDDGp\n'+
//     //'JFIVp7sEiHObSn32obo6PAUTurO9LyQqQEwR0ImExQ8LEDKfZC5tpwfvQ2hpHbci\n'+
//     //'1QmcZ28mtoKeHpaNxswko0hVPKNSidE1H3gn0owPlC6Fwmq7eitPFN17Sdvr3bhl\n'+
//     //'d7TG2OKolHljgqqZbwIDAQAB\n'+
//     //'-----END PUBLIC KEY-----';
//     //
//     //
//     //key.importKey(pKey,'pkcs8-public');
//     //
//     ////clientKey.setOptions({encryptionScheme: 'pkcs1'}) //就是新增这一行代码
//     //let encrypted = key.encrypt(message, 'base64')
//     //
//     //console.log('加密后数据'+encrypted);
//     //
//     //let pri = '-----BEGIN RSA PRIVATE KEY-----\n'+
//     //    'MIICXgIBAAKBgQDafbgu6kK5Ju8VGjyhZqlFDDGpJFIVp7sEiHObSn32obo6PAUT\n'+
//     //    'urO9LyQqQEwR0ImExQ8LEDKfZC5tpwfvQ2hpHbci1QmcZ28mtoKeHpaNxswko0hV\n'+
//     //    'PKNSidE1H3gn0owPlC6Fwmq7eitPFN17Sdvr3bhld7TG2OKolHljgqqZbwIDAQAB\n'+
//     //    'AoGBAM8K6TkT5ix7130gwqmTlf2HQ5vrfhllO1RdVWennFvU/5rle04p0t8IR/X9\n'+
//     //    'vdf3zAjTj6DFNaNTFKf16w/wyYNpQIvYwiNwxkWUytGi3DnES41y/Y8/Qm4md0RI\n'+
//     //    'KtYx/Lygv3A9i4G0P3o//eXqPsTcqbkCN6QRggS6yMCDEgwhAkEA/aZVWV+gefom\n'+
//     //    'kAKuLjWPcQ2C9yWLNe+SG/LPLrjV54iRLQ/RiXGsm51RTUYZfOxbmRPp5CccPozm\n'+
//     //    'L5E29130/wJBANyD/QsnNgrfxqueswj34RxSQZk6Nu1B2qJjRQTUg8fbFvZ9PgGy\n'+
//     //    'CCWnQQ9csNWmwdCkT5nmHF7TqHqTRKW0K5ECQQD5L++pXcjKDHbWA8wamYPSDPQc\n'+
//     //    '2UVqN3HTAzeHLw7157S4EFJKNOLd/i9hOvzPPWS/flDJU6Lr0IBTOtZFLokBAkAI\n'+
//     //    'Z7eDb1EuBO2LqRbl5pzb+X6qmn9xd6sfuWzuDDOhsIYliwyL//8zgDaIoV3UJvEI\n'+
//     //    'RNsL4KuAKc0oLujU8BMhAkEA4ohT76qLsXENdvE4Td2PBrenp+h5oh9JsvXat2dN\n'+
//     //    'jsg49YqYJJedE4CQuNmRpc9icAKI7Li1YoyYd6BLjbSdgg==\n'+
//     //    '-----END RSA PRIVATE KEYY-----';
//     //
//     //let clientKey = new NodeRSA();
//     //clientKey.importKey(pri,'pkcs1');
//     //var decryptedPassword =  clientKey.decryptPublic(encrypted,'utf8');
//     //console.log('解密后的数据'+decryptedPassword);
// }
//
// var hotPathFilePatch;
//
// //测试环境 10.10.223.41:3333/data/apkstore
// exports.patchDir = '/apkstore/';
//
// exports.apkDir = '/apkstore/';
//
// exports.rsa = rsa;
// exports.sftp = sftp;
//
// exports.sftpServer = sftpServer;
//
// exports.appendStrem  = appendStrem;
//
//
// // 通过 storage 选项来对 上传行为 进行定制化
// exports.upload = multer({storage: storage});
//
// exports.createFileReadStream = function() {
//     return fs.createReadStream(hotPathFilePatch);
// }
//
// exports.getPatchFileURL = function (originalname) {
//    return hotPathFilePatch = uploadFolder + '/' + originalname;
// }