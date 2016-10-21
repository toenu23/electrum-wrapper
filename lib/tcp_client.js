module.exports = function(client, options) {

  var net = require('net');
  var socket = new net.Socket();

  socket.connect(options.port, options.host, function() {
    //console.log('TCP connection established');
  });

  socket.on('data', function(data) {
    client.response(null, data);
  });

  socket.on('close', function() {
    //console.log('TCP Connection closed');
  });

  this.request = function(data) {
    socket.write(data + '\n');
  };

  return this;
};
