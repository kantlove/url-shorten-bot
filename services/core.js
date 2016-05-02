var mysql = require('../helpers/mysql.js');
var randomstring = require('random-string');
var Promise = require('promise');
var async = require('async');
var debug = require('../helpers/debug.js');

var Core = function () {};

var domain = 'dev.mthai.me';
var suffix_length = 8;

Core.prototype.process = function (url) {
  // Post-processing steps
  return new Promise(function (resolve, reject) {
    shorten(url).then(
      function (suffix) {
        // Asynchronously save the new suffix into DB
        saveEntry(url, suffix).then(
          function (results) {},
          function (err) {}
        );
        
        resolve(makeUrl(suffix));
      },
      function (err) {
        reject(err);
      }
    );
  });
};

function shorten(url) {
  var query = {
    sql: 'SELECT suffix FROM registered_url R JOIN  shortened_url S ON R.id = S.url_id WHERE R.url = ? LIMIT 1',
    timeout: 5000,
    values: [url]
  };

  return new Promise(function (resolve, reject) {
    mysql.query(query).then(
      function (results) {
        if(results && results.length > 0) {
          var suffix = results[0].suffix;
          resolve(suffix);
        }
        else { // not found in DB
          createNewEntry().then(
            function (newSuffix) {
              resolve(newSuffix);
            },
            function (err) {
              reject(err);
            }
          );
        }
      }, 
      function (err) {
        reject(err);
      }
    );
  });
}

function createNewEntry () {
  return new Promise(function (resolve, reject) {
    async.retry(
      10, // run at most 10 times
      function (callback, prevResults) {
        var suffix = randomstring({ length: 8 });
        var query = {
          sql: 'SELECT id FROM shortened_url WHERE suffix = ? LIMIT 1',
          timeout: 5000,
          values: [suffix]
        };

        mysql.query(query).then(
          function (results) {
            if(results && results.length > 0)
              callback(); // suffix exists in DB, keep looping
            else
              callback(null, suffix); // ok stop, suffix is available
          },
          function (err) {
            callback(err); // error, stop.
          }
        );
      },
      function (err, result) {
        if(err)
          reject('All suffixes are used or it can be other error ' + err);
        else
          resolve(result ? result : 'Sorry! No available url :(');
      }
    );
  });
}

/**
 * Save the request url and the newly created suffix 
 * into the DB
 */
function saveEntry (url, newSuffix) {
  return new Promise(function (resolve, reject) {
    var insert_url_query = {
      sql: 'INSERT INTO registered_url (url) VALUES (?)',
      timeout: 5000,
      values: [url]
    };
    var insert_suffix_query = {
      sql: 'INSERT INTO shortened_url (suffix, url_id) SELECT ?, id FROM registered_url WHERE url = ? LIMIT 1',
      timeout: 5000,
      values: [newSuffix, url]
    };
    
    async.series([
      function (callback) {
        mysql.query(insert_url_query).then(
          function (results) {
            callback();
          },
          function (err) {
            callback(err);
          }
        );
      },
      function (callback) {
        mysql.query(insert_suffix_query).then(
          function (results) {
            callback();
          },
          function (err) {
            callback(err);
          }
        );
      }],
      function (err) {
        if (err)
          reject(err);
        else
          resolve();
      }
    );
  });
}

function deleteOutdatedUrl (url) {
  
}

function createSuffix () {
  return randomstring({ length: suffix_length });
}

function makeUrl (suffix) {
  return domain + '/' + suffix;
}

module.exports = new Core();