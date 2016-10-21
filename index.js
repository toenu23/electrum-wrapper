module.exports = function(options) {

  var Client = require('./lib/client');

  if (!options || !options.host || !options.protocol) {
    return new Error('Missing arguments');
  }

  if (!options.port) {
    options.port = (options.protocol == 'tls')
      ? 50002
      : 50001;
  }

  return new Client(options);

};
