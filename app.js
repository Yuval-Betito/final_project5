/**
 * Express app for managing costs and users.
 *
 * This module initializes the Express application, connects to the MongoDB database,
 * sets up middleware for parsing JSON requests, mounts the API routes for users, costs,
 * and team member information, and defines a global error handler.
 *
 * @module app
 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Import routes for handling various API requests.
const usersRoutes = require('./routes/users');
const costsRoutes = require('./routes/costs');
const aboutRoutes = require('./routes/about');

// Create an instance of the Express application.
const app = express();

/**
 * Connect to MongoDB using the MongoDB URI.
 * This initializes the connection to the MongoDB Atlas database.
 *
 * @param {string} MONGO_URI - The URI string to connect to MongoDB, read from the environment variables.
 * @throws {Error} Throws an error and stops the server if the connection fails.
 */
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Stop the server if the connection fails.
  });

// Middleware to parse JSON body data.
// This middleware converts incoming request bodies in JSON format into JavaScript objects.
app.use(bodyParser.json());

/**
 * Routes for handling user-related API requests.
 * These routes include operations such as adding a user and retrieving user details.
 *
 * Mounted at the '/api/users' path.
 *
 * @type {Route}
 */
app.use('/api/users', usersRoutes);

/**
 * Routes for handling cost-related API requests.
 * These routes include operations such as adding cost items and generating reports.
 *
 * Mounted at the '/api' path.
 *
 * @type {Route}
 */
app.use('/api', costsRoutes);

/**
 * Routes for retrieving team member information.
 * This route returns the list of team members with their first and last names.
 *
 * Mounted at the '/api/about' path.
 *
 * @type {Route}
 */
app.use('/api/about', aboutRoutes);

/**
 * Global error handler for the application.
 * This middleware catches errors that are not handled by specific routes and sends a generic error response.
 *
 * @param {Error} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The callback to pass control to the next middleware.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the app module so it can be used in other parts of the project (e.g., to start the server).
module.exports = app;


