module.exports = function(client, options) {

  var net = require('net');
  var socket = new net.Socket();
  var buffer = new Buffer('');

  socket.connect(options.port, options.host, function() {
    //console.log('TCP connection established');
  });

  socket.on('data', function(data) {

    buffer = Buffer.concat(
      [buffer, new Buffer(data)]
    );

    var str = buffer.toString();
    if (str.slice(-1) == '\n') {
      buffer = new Buffer('');
      client.response(null, str);
    }

  });

  socket.on('end', function() {
    //client.response(buffer);
  });

  socket.on('close', function() {
    //console.log('TCP Connection closed');
  });

  this.request = function(data) {
    socket.write(data + '\n');
  };

  return this;
};
