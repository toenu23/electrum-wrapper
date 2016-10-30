module.exports = function(client, options) {

  const net = require('net');
  const socket = new net.Socket();
  let buffer = new Buffer('');

  socket.connect(options.port, options.host, function() {
    //Console.log('TCP connection established');
  });

  socket.on('data', function(data) {

    buffer = Buffer.concat(
      [buffer, new Buffer(data)]
    );

    const str = buffer.toString();
    if (str.slice(-1) == '\n') {
      buffer = new Buffer('');
      client.response(null, str);
    }

  });

  socket.on('close', function() {
    //Console.log('TCP Connection closed');
  });

  this.exit = function() {
    socket.end();
  };

  this.request = function(data) {
    socket.write(data + '\n');
  };

  return this;
};
