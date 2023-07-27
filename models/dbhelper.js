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
    database : config.db_name
});

var DB = {};


module.exports = DB;

DB.query=function(sql,callback){
    console.log(sql);
    pool.getConnection(function(err,conn){
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
            callback(err,null,null);
        }
        callback(connection);
    });
};


DB.query_object=function(sql,obj,callback){
    console.log(sql,obj);
    pool.getConnection(function(err,conn){
        if(err){
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
        callback(conn);
    });
}
//事务连接
DB.getConnection=function(callback){
    var connection=mysql.createConnection(pool);
    connection.connect(function(err){
        if(err){
            console.error('error connecting: ' + err.stack);
        }
        callback(err,connection);
    });
}