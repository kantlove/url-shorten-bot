var colors = require('colors');

var Debug = function () {}; // dummy object

Debug.prototype.log = function (value) {
  var str = isString(value) ? value : JSON.stringify(value);
  console.log(colors.grey(makeString(str)));
};

Debug.prototype.err = function (value) {
  var str = isString(value) ? value : JSON.stringify(value);
  console.log(colors.red(makeString(str)));
};
              
function makeString(text) {
  var time = getCurrentTimeString();
  return time + ' ' + text;
}

function isString(obj) {
  return typeof obj === 'string';
}

// Return time from Date.now in a printable string
function getCurrentTimeString() {
  var date = new Date();
  var str = 
    '[' + date.toDateString() + ' ' 
    + ensureLength(date.getHours(), 2) + ':' 
    + ensureLength(date.getMinutes(), 2) + ':' 
    + ensureLength(date.getSeconds(), 2) + ']';
  return str;
}

function ensureLength(str, len) {
  var pad = '0';
  while(str.length < len)
    str = pad + str;
  return str;
}

module.exports = new Debug();