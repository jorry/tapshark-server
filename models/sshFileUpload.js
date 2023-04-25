/**
 * Created by iqianjin-liujiawei on 17/3/7.
 */
var node_ssh = require('node-ssh');

var shelljs = require('shelljs');;
var ftpUtils = require('./sftpUtil');

var ssh = new node_ssh();


exports.uploadFile = function(localPatch,remotePatch,callback){
    console.log('开始远程上传');
    ssh.connect({
        host:ftpUtils.sftpServer.host,
        username:ftpUtils.sftpServer.username,
        password: ftpUtils.sftpServer.password,
        port: ftpUtils.sftpServer.port
    }).then(function(){

        console.log(ftpUtils.sftpServer.host+'apk文件上传','本地路径'+localPatch,'服务器路径'+ftpUtils.apkDir+remotePatch);

        ssh.putFile(localPatch,ftpUtils.apkDir+remotePatch).then(function() {
            console.log("The File thing is done")
            ssh.dispose();
            callback(200,'上传完成');
        }, function(error) {
            ssh.dispose();
            console.log("Something's wrong")
            console.log(error);
            callback(201,'上传失败:'+error);
        }).catch(function(err){
            console.log('file ssh err '+err);
            callback(202,'上传失败:'+err);
            ssh.dispose();
        });
    }).catch(function(err){
        console.log('file ssh err '+err);
        ssh.dispose();
        callback(203,'上传失败:'+err);
    });
}