var Credentials = function () {};

Credentials.prototype.page_token = process.env.PAGE_TOKEN;

module.exports = new Credentials();