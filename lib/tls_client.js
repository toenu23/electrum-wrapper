module.exports = function(client, options) {

  var tls = require('tls');

  var socket = tls.connect(options.port, options.host, options, function() {
    console.log('TLS connected');
    socket.setEncoding('utf-8');
  });

  socket.addListener('data', function(data) {
   client.response(data);
  });

  socket.addListener('error', function(error) {
    console.log(error);
  });

  socket.addListener('close', function() {
    console.log('TLS Connection closed');
  });

  this.request = function(data) {
    socket.write(data + '\n');
  };
  
  return this;
};
