var expect = require('expect.js');
var sinon = require('sinon');
var poll = require('../lib/poll');

describe('poll', function() {
  describe('#poll', function() {
    it('calls callback', function(done) {
      var pollFn = function() {};
      var callback = sinon.stub().returns(false);
      poll(pollFn, callback);
      setImmediate(function() {
        expect(callback.calledOnce).to.be(true);
        done();
      });
    });

    it('calls callback repeatedly', function(done) {
      var pollFn = function() {};
      var callback = sinon.stub();
      poll(pollFn, callback);
      callback.onCall(0).returns(true);
      callback.onCall(1).returns(false);
      setImmediate(function() {
        setImmediate(function() {
          expect(callback.calledTwice).to.be(true);
          done();
        });
      }); 
    });

    context('when callback returns false', function() {
      it('stops polling', function(done) {
        var pollFn = function() {};
        var callback = sinon.stub();
        poll(pollFn, callback);
        callback.onCall(0).returns(false);
        setTimeout(function() {
          expect(callback.calledOnce).to.be(true);
          done();
        }, 500); 
      });
    });
  });

});
