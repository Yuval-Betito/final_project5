/**
 * Express app for managing costs and users.
 *
 * @module app
 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const usersRoutes = require('./routes/users');
const costsRoutes = require('./routes/costs');
const aboutRoutes = require('./routes/about');

const app = express();

/**
 * Connect to MongoDB using the MongoDB URI.
 * This will initialize the connection to the MongoDB Atlas database.
 *
 * @param {string} MONGO_URI - The URI string to connect to MongoDB.
 * @throws {Error} Will throw an error if the connection fails.
 */

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.error('Error connecting to MongoDB:', err);
      process.exit(1); // Stop the server if the connection fails
    });

// Middleware to parse JSON body data
app.use(bodyParser.json());

/**
 * Routes for handling user-related API requests.
 *
 * @type {Route}
 */

app.use('/api/users', usersRoutes);

/**
 * Routes for handling cost-related API requests.
 *
 * @type {Route}
 */
app.use('/api', costsRoutes);

/**
 * Routes for retrieving team member information.
 *
 * @type {Route}
 */
app.use('/api/about', aboutRoutes);

/**
 * Global error handler for the application.
 * This will catch errors that are not handled by the specific routes.
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

module.exports = app;


