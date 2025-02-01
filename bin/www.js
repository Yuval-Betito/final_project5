#!/usr/bin/env node
/**
 * @fileoverview This file is the entry point for the final project server.
 * It creates an HTTP server using Express and listens on a specified port.
 * The server configuration and error handling are defined here.
 *
 * @module bin/www
 */

/**
 * Module dependencies.
 */
const app = require('../app');
const debug = require('debug')('final-project:server');
const http = require('http');

/**
 * Get port from environment and store in Express.
 * If no PORT is provided via environment variables, defaults to '3000'.
 * The normalized port is then set in the Express app.
 *
 * @type {number|string|boolean}
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 * The Express app is passed to the http.createServer method to create the server.
 *
 * @type {http.Server}
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 * The server starts listening on the defined port.
 * Event listeners for 'error' and 'listening' events are attached.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 *
 * @param {string} val - The port value as a string.
 * @returns {number|string|boolean} The normalized port number, the original string if it is a named pipe, or false if invalid.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 * Handles specific listen errors with friendly messages and exits the process if needed.
 *
 * @param {Error} error - The error object received from the server.
 * @throws Will throw an error if the error is not related to the 'listen' syscall.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 * When the server starts listening, this function logs a debug message with the bind (port or pipe).
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
