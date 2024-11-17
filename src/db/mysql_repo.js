// import mysql from 'mysql';
import mysql from 'mysql2';

// const mysql_pool  = mysql.createPool({
//     connectionLimit: 50,
//     host: '95.216.2.208', // cloud2.zolahost.net
//     user: 'cashfrom_profile',
//     password: 'Encasherr123',
//     database: 'cashfrom_profiledb_dev',
//     acquireTimeout: 1000000
// });

// const mysql_pool  = mysql.createPool({
//     connectionLimit: 50,
//     host: 'localhost',
//     // host: '103.212.121.53', 
//     user: 'tpptxbaq_app_write',
//     password: 'Encasherr123',
//     database: 'tpptxbaq_profiledb'
// });

// const mysql_pool  = mysql.createPool({
//     connectionLimit: 50,
//     host: '172.17.0.2',
//     port: 3306,
//     user: 'ta_app_write',
//     password: 'Encasherr123',
//     database: 'ta_profiledb'
// });
var mysqlHost = process.env.MYSQL_HOST || 'localhost';
var mysqlPort = process.env.MYSQL_PORT || '13306';
var mysqlUser = process.env.MYSQL_USER || 'tp_app1';
var mysqlPass = process.env.MYSQL_PASS || 'tech';
var mysqlDB   = process.env.MYSQL_DB   || 'ta_profiledb';

var connectionOptions = {
    connectionLimit: 50,
    host: mysqlHost,
    port: mysqlPort,
    user: mysqlUser,
    password: mysqlPass,
    database: mysqlDB
};
const mysql_pool  = mysql.createPool(connectionOptions);

const getData = (query) => {
    // connection.connect((err) => {
    //     console.log('error in open connection', err);
    // });
    // connection.connect();
    console.log('mysqlHost: ', mysqlHost);

    var promise = new Promise((resolve, reject) => {

        console.log('getdata query: ', query);
        mysql_pool.getConnection((err, connection) => {
            if (err) {
                //connection.release();
                console.log(' Error getting mysql_pool connection: ' + err);
                reject(err);
            }
            else{
                connection.query(query, (error, results, fields) => {
                    if(error) {
                        console.log('error in query execution: ', error);
                        reject(error);
                    }
                    console.log('success retrieval');
                    console.log('release connection');
                    connection.release();
                    resolve(results);
                });
            }
        }) 
    })

    return promise;

}

const executeQuery = (query) => {
    var promise = new Promise((resolve, reject) => {

        console.log('execute query: ', query);
        mysql_pool.getConnection((err, connection) => {
            if (err) {
                //connection.release();
                console.log(' Error getting mysql_pool connection: ' + err);
                reject(err);
            }
            else{
                connection.query(query, (error, results, fields) => {
                    if(error) {
                        console.log('error in query execution: ', error);
                        reject(error);
                    }
                    console.log('connection released after query execution');
                    connection.release();
                    resolve(results);
                });
            }
        }) 
    })

    return promise;
}

export {
    getData,
    executeQuery
}