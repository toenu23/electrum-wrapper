
var ElectrumClient = require('../index');


/**
 * Create a new instance of our client
 *
 * The following options are available:
 *
 * protocol: 'tcp' or 'tls' (required)
 * host: IP or hostname (required)
 * port: Defaults to 50001 (tcp) and 50002 (tls)
 *
 * When using TLS you may set other options which will be
 * passed to the tls.connect() function
 * (https://nodejs.org/api/tls.html#tls_tls_connect_options_callback)
 *
 */
var client = new ElectrumClient({
  protocol: 'tcp',
  host: 'electrum.online',
  port: 50001,
});


/**
 * Now we can send commands to the Electrum server
 * See http://docs.electrum.org/en/latest/protocol.html
 * for API documentation
 *
 * Let's get the transaction history of a Bitcoin address
 */
var address = '1NS17iag9jJgTHD1VXjvLCEnZuQ3rJDE9L';
client.request(
  'blockchain.address.get_history',
  [address],
  function(data) {
    console.log(
      '%s transactions found for address %s.',
      data.result.length,
      address
    );
  }
);

/**
 * Let's subscribe for notifications on new blocks in the
 * Bitcoin blockchain ...
 */
client.request('blockchain.numblocks.subscribe', [], function(data) {
  console.log(
    'Subscribed for new BTC blocks. Current height: %s',
    data.result
  );
});


/**
 * ... and register the callback function to be called when the
 * server notifies us of new blocks
 */
client.on('blockchain.numblocks.subscribe', function(data) {
  console.log(
    'New BTC block in the chain - New height: %s',
    data.params[0]
  );
});


/**
 * Error handler
 */
client.on('error', function(err) {
  // An error occured
  console.log(err);
});

/**
 * Exit will close open TCP socket
 */

//  client.exit();
