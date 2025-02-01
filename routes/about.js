/**
 * @fileoverview Defines the route for retrieving team member information.
 * This route returns a JSON array containing the first and last names of the team members.
 *
 * @module routes/about
 */

const express = require('express');
const router = express.Router();

/**
 * An array of team members.
 * Each team member is an object containing:
 * @property {string} first_name - The first name of the team member.
 * @property {string} last_name - The last name of the team member.
 *
 * @type {Array<Object>}
 */
const teamMembers = [
  { first_name: 'Yuval', last_name: 'Betito' },
  { first_name: 'Hen', last_name: 'Ben Gigi' }
];

/**
 * GET /api/about
 * Retrieves a list of team members.
 *
 * @name GET /api/about
 * @function
 * @memberof module:routes/about
 * @inner
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void} Sends a JSON response containing the team members.
 */
router.get('/', (req, res) => {
  res.json(teamMembers);
});

module.exports = router;
