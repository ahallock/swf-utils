var Promise = require('bluebird');
var RateLimiter = require('limiter').RateLimiter;

module.exports = function poll(pollFn, cb, delay) {
  var removeToken = function(_) { return Promise.resolve(); };
  if (delay) {
    var limiter = new RateLimiter(1, delay);
    removeToken = Promise.promisify(limiter.removeTokens, limiter);
  }

  function callPollFn() {
    return removeToken(1)
      .then(pollFn)
      .then(cb)
      .then(function(continuePolling) {
        if (continuePolling) return callPollFn(); 
      });
  }
  return callPollFn();
}
