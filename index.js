"format cjs";

var engine = require('./engine');
var edeliaTypes = require('./types.json');

module.exports = engine({
  types: edeliaTypes.types
});
