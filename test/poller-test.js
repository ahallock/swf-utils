require('./helper');
var expect = require('expect.js');
var nock = require('nock');
var Poller = require('../lib/poller');

var params = {
  domain: 'domain',
  taskList: {
    name: 'mylist' 
  }
}

describe('Poller', function() {
  afterEach(function(done) {
    nock.cleanAll();
    done();
  });

  describe('#on', function() {
    it('emits activity data', function(done) {
      nock('https://swf.us-east-1.amazonaws.com')
        .matchHeader('X-Amz-Target', 'SimpleWorkflowService.PollForActivityTask')
        .post('/', params)
        .reply(200, {
          taskToken: '123'   
        });
      var poller = new Poller('activity', params);
      poller.start();
      poller.on('task', function(task) {
        expect(task.taskToken).to.eql('123');
        poller.stop();
        done();
      });
    });
  });

});
