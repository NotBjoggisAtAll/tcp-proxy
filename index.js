const net = require('net');

// Get the host and listen port from the environment variables
const host = process.env.HOST;
const port = process.env.PORT;

// Check if the host and listen port are provided
if (!host || !port) {
  console.error('Host or port is not specified. Please set the HOST and PORT environment variables.');
  process.exit(1);
}

// Create a TCP server that listens for incoming connections on the specified port
const server = net.createServer((client) => {
  // Establish a connection to the specified host on the specified port
  const serverSocket = net.createConnection({
    host: host,
    port: port
  });

  // Pipe data between the client and the server
  client.pipe(serverSocket);
  serverSocket.pipe(client);

  // Handle errors
  client.on('error', (err) => console.error('Client error:', err));
  serverSocket.on('error', (err) => console.error('Server socket error:', err));

  // Close the connection when either the client or server socket is closed
  client.on('close', () => serverSocket.end());
  serverSocket.on('close', () => client.end());
});

// Start the TCP server and listen on the specified port
server.listen(port, () => {
  console.log(`TCP proxy server running on ${port} towards ${host}`);
});
