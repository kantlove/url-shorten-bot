var request = require('superagent');
var credentials = require('./credentials.js');
var mysql = require('../helpers/mysql.js');
var debug = require('../helpers/debug.js');

/**
 * This class contains periodic tasks
 */
var Worker = function () {};

Worker.prototype.start = function () {
  subscribeToPage();
  mysql.init();
};

function subscribeToPage () {
  request
    .post('https://graph.facebook.com/v2.6/me/subscribed_apps')
    .query({ access_token: credentials.page_token })
    .end(function (err, res) {
      if(err)
        throw err;
      debug.log('Subscribed to page.');
    });
}

module.exports = new Worker();