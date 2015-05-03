var R = require('ramda');
var decapitalize = require('underscore.string/decapitalize');

module.exports = function(event) {
  return R.prop(decapitalize(event.eventType)+'EventAttributes', event);
}
