function createLib (execlib) {
  var serversidehelpers = require('./serversidehelperscreator')(execlib);

  return execlib.lib.extend({}, serversidehelpers);
}

module.exports = createLib;
