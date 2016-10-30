module.exports = function(client, options) {

  const tls = require('tls');

  const socket = tls.connect(options.port, options.host, options, function() {
    socket.setEncoding('utf-8');
    //Console.log('TLS connection established');
  });

  socket.addListener('data', function(data) {
    client.response(null, data);
  });

  socket.addListener('error', function(error) {
    client.response(error);
  });

  socket.addListener('close', function() {
    //Console.log('TLS Connection closed');
  });

  this.exit = function() {
    socket.end();
  };

  this.request = function(data) {
    socket.write(data + '\n');
  };

  return this;
};
