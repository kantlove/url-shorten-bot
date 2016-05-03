var express = require('express');
var router = express.Router();
var Promise = require('promise');
var mysql = require('../helpers/mysql.js');
var debug = require('../helpers/debug.js');

router.get('/:suffix', function (req, res) {
  var suffix = req.params.suffix;
  if (!suffix)
    res.status(404).send(err);
  else {
    redirect(suffix).then(
      function (original_url) {
        res.redirect(original_url);
      },
      function (err) {
        res.status(404).send(err);
      }
    );
  }
});

function redirect(suffix) {
  var query = {
    sql: 'SELECT url FROM registered_url R JOIN  shortened_url S ON R.id = S.url_id WHERE S.suffix = ? LIMIT 1',
    timeout: 5000,
    values: [suffix]
  };

  return new Promise(function (resolve, reject) {
    mysql.query(query).then(
      function (results) {
        if (results && results.length > 0) {
          var url = results[0].url;
          resolve(url);
        }
        else { // not found in DB
          reject('Sorry, Your URL cannot be found :(');
        }
      },
      function (err) {
        reject(err);
      }
    );
  });
}

module.exports = router;