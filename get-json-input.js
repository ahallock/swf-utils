var R = require('ramda');
var attrs = require('./get-attributes');

module.exports = R.compose(
  JSON.parse,
  R.prop('input'),
  attrs
);
