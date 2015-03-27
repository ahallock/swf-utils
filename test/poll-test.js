var expect = require('expect.js');
var nock = require('nock');
var sinon = require('sinon');

process.env.AWS_DEFAULT_REGION = 'us-east-1';
process.env.AWS_SWF_DOMAIN = 'domain';
process.env.AWS_ACCESS_KEY_ID = '123';
process.env.AWS_SECRET_ACCESS_KEY = 'abc';

var poll = require('../lib/poll');
var Promise = require('bluebird');

function setupNock(taskType, replyJson) {
  taskType || (taskType = 'activity')
  var amzTargetHeader;
  if (taskType === 'activity') {
    amzTargetHeader = 'SimpleWorkflowService.PollForActivityTask';
  } else {
    amzTargetHeader = 'SimpleWorkflowService.PollForDecisionTask';
  }
  nock('https://swf.us-east-1.amazonaws.com')
    .persist()
    .matchHeader('X-Amz-Target', amzTargetHeader)
    .filteringRequestBody(function(path) {
      return '*';
    })
    .post('/', '*')
    .reply(200, replyJson);
}

describe('poller', function() {
  beforeEach(function(done) {
    setupNock('activity', { taskToken: '123' });
    done();
  });

  afterEach(function(done) {
    nock.cleanAll();
    done();
  });

  describe('#poll', function() {
    it('calls the decide function', function(done) {
      function decide() { done(); }

      var p = poll('activity', 'task-list', decide)
        .catch(Promise.CancellationError, function(e){})
        .cancel();
    });

    it('rate limits decide calls', function(done) {
      var counter = 0;
      function decide() { counter++; };

      var p = poll('activity', 'task-list', decide, 1, 250)
        .catch(Promise.CancellationError, function(e){});

      expect(counter).to.be(0);
      setTimeout(function() {
        expect(counter).to.be(2);
        p.cancel();
        done();
      }, 500);
    });

    it('polls for decision tasks', function(done) {
      nock.cleanAll();
      setupNock('decision');
      var p = poll('decision', 'task-list', function(){ p.cancel(); })
        .catch(Promise.CancellationError, function(e){});
      done();
    });

    context('no task', function() {
      it('skips decide', function(done) {
        var spy = sinon.spy();
        nock.cleanAll();
        setupNock('activity', {});
        var p = poll('activity', 'task-list', spy)
          .catch(Promise.CancellationError, function(e){});

        // TODO: find easier way to determine if loop
        //       has executed at least once
        setTimeout(function() {
          p.cancel();
          expect(spy.callCount).to.be(0);
          done();
        }, 200);
      });
    });
  });
});
