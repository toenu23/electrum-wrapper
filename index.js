module.exports = function(options) {

  var Client = require('./lib/client');

  if (!options) {
    options = {};
  }

  var defaults = {
    protocol: 'tls',
    host: 'electrum.online',
  };

  for (key in defaults) {
    if (!options[key]) {
      options[key] = defaults[key];
    }
  }

  if (!options.port) {
    options.port = (options.protocol == 'tls')
      ? 50002
      : 50001;
  }

  return new Client(options);

};
