module.exports = function(client, options) {

  var tls = require('tls');

  var socket = tls.connect(options.port, options.host, options, function() {
    socket.setEncoding('utf-8');
    //console.log('TLS connection established');
  });

  socket.addListener('data', function(data) {
   client.response(null, data);
  });

  socket.addListener('error', function(error) {
    client.response(error);
  });

  socket.addListener('close', function() {
    //console.log('TLS Connection closed');
  });

  this.request = function(data) {
    socket.write(data + '\n');
  };
  
  return this;
};
