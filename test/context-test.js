var expect = require('expect.js');
var context = require('../lib/context');
var events = require('./events');
var ctx = context.create(
  { events: events, previousStartedEventId: 0 }, {});

describe('context', function() {
  describe('.create', function() {
    it('creates a new context', function() {
      var newCtx = context.create(
        { events: events, previousStartedEventId: 5 }, { foo: 'bar'}
      );
      expect(newCtx.unhandledEvents).to.not.be(undefined);
      expect(newCtx.eventHistory).to.not.be(undefined);
      expect(newCtx.decisions).to.eql([]);
      expect(newCtx.workflowConfig).to.eql({ foo: 'bar' });
    });
  });
  describe('#next', function() {
    it('creates a new context', function() {
      var ctx2 = ctx.next([], []);
      expect(ctx2.constructor.name).to.be('Context');
    });
    it('removes handled events', function() {
      var ctx2 = ctx.next([{ eventId: 1 }], []);
      expect(ctx.unhandledEvents.length).to.be(events.length);       
      expect(ctx2.unhandledEvents.length).to.be(events.length - 1);       
    });
    it('concats decisions', function() {
      var ctx2 = ctx.next([{ eventId: 1 }], [{}]);
      expect(ctx.decisions.length).to.be(0);       
      expect(ctx2.decisions.length).to.be(1);       
    });
  });
});

