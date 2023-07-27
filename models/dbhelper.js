/**
 * Created by iqianjin-liujiawei on 16/11/1.
 */

var mysql = require('mysql');
var config = require('../config/config');

const pool = mysql.createPool({
    host : config.db_host,
    port : config.db_port,
    user : config.username,
    password : config.password,
    database : config.db_name,
    connectTimeout: 10000 // 20 seconds
});

var DB = {};


module.exports = DB;

DB.query=function(sql,callback){
    console.log(sql);
    pool.getConnection(function(err,conn){
        console.log('query .err = '+err);
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,function(qerr,vals,fields){
                //释放连接
                conn.release();
                //事件驱动回调
                callback(qerr,vals);
            });
        }
    });
};

DB.beginTransaction=function(callback){
    pool.getConnection(function(err,connection){
        if(err){
            console.log('beginTransaction  .err= '+err);
            callback(err,null,null);
        }
        console.error('beginTransaction .成功 = : ' + err);
        callback(connection);
    });
};


DB.query_object=function(sql,obj,callback){
    console.log(sql,obj);
    pool.getConnection(function(err,conn){
        if(err){
            console.log('query_object  .err= '+err);
            callback(err,null,null);
        }else{
            console.log("进来了吗")
            conn.query(sql,obj,function(qerr,vals,fields){
                //释放连接
                conn.release();
                //事件驱动回调
                callback(qerr,vals);
            });
        }
    });
};
DB.connect = function (callback){
    return pool.getConnection(function (err,conn){
        console.log('connect  .err= '+err);
        callback(conn);
    });
}
//事务连接
DB.getConnection=function(callback){
    var connection=mysql.createConnection(pool);
    connection.connect(function(err){
        if(err){
            console.error('getConnection .err = : ' + err.stack);
        }
        console.error('getConnection .成功 = : ' + err);
        callback(err,connection);
    });
}