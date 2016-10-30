module.exports = function(options) {

  const TcpClient = require('./tcp_client');
  const TlsClient = require('./tls_client');

  let client;
  let requestId = 0;
  var callbacks = {
    error: function(e) { console.error(e); },
  };
  const parent = this;

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

  this.response = function(err, data) {

    if (err) {
      callbacks.error(err);
      return;
    }

    try {
      var response = JSON.parse(data);
    } catch (e) {
      callbacks.error(e);
      return;
    }

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

  this.keepAlive = function(data) {
    setTimeout(
      function() {
        parent.request('server.version', [], parent.keepAlive);
      },
    60000);
  };

  this.on = function(event, callback) {
    if (event == 'error') {
      callbacks.error = callback;
      return;
    }
    if (!callbacks[event]) {
      callbacks[event] = [];
    }
    callbacks[event].push(callback);
  };

  client = (options.protocol == 'tls')
    ? new TlsClient(this, options)
    : new TcpClient(this, options);

  this.keepAlive();
  return this;

};
