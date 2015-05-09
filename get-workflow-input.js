var R = require('ramda');
var filterEvents = require('./filter-events');
var getAttrs = require('./get-attributes');

module.exports = R.compose(
  R.prop('input'),    
  getAttrs,
  R.head,
  filterEvents.workflowExecutionStarted    
);
