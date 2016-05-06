var express = require('express');
var router = express.Router();
var request = require('superagent');
var core = require('../services/core.js');
var credentials = require('../services/credentials.js');
var async = require('async');
var Promise = require('promise');
var validUrl = require('valid-url');
var debug = require('../helpers/debug.js');

// This route is used for verification
router.get('/', function (req, res) {
  var verify_token = 'verify_me';
  if (req.query['hub.verify_token'] === verify_token) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

router.post('/', function (req, res) {
  var messages = req.body.entry[0].messaging;

  async.each(
    messages,
    function (msg, callback) {
      var sender = msg.sender.id;
      if (msg.message && msg.message.text) {
        var text = normalize(msg.message.text);
        debug.log('Received: ' + text);

        if (validUrl.isUri(text)) {
          core.process(text).then(
            function (shortened_url) {
              sendTextMessage(sender, shortened_url);
              callback();
            },
            function (err) {
              callback(err);
            }
          );
        }
        else {
          sendTextMessage(sender, 'No no this is not a valid URL :(');
          callback();
        }
      }
      else {
        callback();
      }
    },
    function (err) { // callback of async
      if (err)
        debug.log(err);
    }
  );

  res.sendStatus(200);
});

function normalize(url) {
  if(url)
    return url.trim();
  return url; // null, empty, etc.
}

function sendTextMessage(receiver, text) {
  var json_data = {
    recipient: {
      id: receiver
    },
    message: {
      text: text
    }
  };

  request
    .post('https://graph.facebook.com/v2.6/me/messages')
    .query({ access_token: credentials.page_token })
    .send(json_data)
    .end(function (err, res) {
      if (err)
        throw err;
      debug.log("Sent: " + text);
    });
}


module.exports = router;