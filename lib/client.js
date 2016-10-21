module.exports = function(options) {

  var TcpClient = require('./tcp_client');
  var TlsClient = require('./tls_client');

  var client;
  var requestId = 0;
  var callbacks = {};

  this.request = function(method, params, callback) {

    requestId++;

    callbacks[requestId] = callback;

    var message = {
      id: requestId,
      method: method,
      params: params,
    };

    var json = JSON.stringify(message);

    client.request(json);
  };

  this.response = function(data) {

    var response = JSON.parse(data);
    var requestId = response.id;
    var callbackId = requestId
      ? requestId
      : response.method;
    var callback = callbacks[callbackId];

    if (typeof callback === 'function') {
      callback(response);
    }

    if (callback instanceof Array) {
      for (var i in callback) {
        callback[i](response);
      }
    }

  };

  this.on = function(method, callback) {
    if (!callbacks[method]) {
      callbacks[method] = [];
    }
    callbacks[method].push(callback);
  };

  client = (options.protocol == 'tls')
    ? new TlsClient(this, options)
    : new TcpClient(this, options);

  return this;
};
