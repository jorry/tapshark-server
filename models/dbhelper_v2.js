/**
 * Created by iqianjin-liujiawei on 16/11/1.
 */

var mysql = require('mysql2/promise');
var config = require('../config/config');

const pool = mysql.createPool({
    connectionLimit: 10,
    host : config.db_host,
    port : config.db_port,
    waitForConnections: true,
    queueLimit: 0,
    user : config.username,
    password : config.password,
    database : config.db_name
});
async function executeTransaction(callback) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        await callback(connection);
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        callback(null);
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    executeTransaction,
};