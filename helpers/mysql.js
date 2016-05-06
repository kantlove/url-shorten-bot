var mysql = require('mysql');
var Promise = require('promise');
var debug = require('./debug.js');

var Mysql = function () {}; // dummy object

var connection;
var database_name = 'msg_bot';

Mysql.prototype.query = function (query) {
  if(!connection) {
    debug.err('MySql connection is not initialized.');
    return [];
  }

  return new Promise(function (resolve, reject) {
    connection.query(query, function (err, results, fields) {
      if(err)
        reject(err);
      else
        resolve(results);
    });
  });
};

Mysql.prototype.close = function () {
  connection.end();
};

Mysql.prototype.init = function () {
  if(!connection) {
    connection = createConnection();
    connection.connect();

    connection.query('USE ' + database_name, function (err) {
      if(err)
        throw err;
      debug.log('MySql connected.');

      keepAlive();
    });
  }
}

// Keep the mysql connection alive forever
function keepAlive() {
  // Run a random query every 5s
  setInterval(function () {
    connection.query('SELECT 1');
  }, 5000);
}

function createConnection() {
  // For development, all access info is available
  var info = getInfo();
  return mysql.createConnection(info);
}

function getInfo() {
  return {
    host: 'localhost',
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD
  };
}

module.exports = new Mysql();