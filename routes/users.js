const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cost = require('../models/Cost');

/**
 * POST /api/users/add
 * Adds a new user.
 * Required fields: id, first_name, last_name, birthday, marital_status.
 */
router.post('/add', async (req, res) => {
  try {
    const { id, first_name, last_name, birthday, marital_status } = req.body;
    if (!id || !first_name || !last_name || !birthday || !marital_status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newUser = new User({
      id,
      first_name,
      last_name,
      birthday,
      marital_status
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'User ID already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

/**
 * GET /api/users/:id
 * Retrieves the details of a specific user along with their total cost.
 * The response contains: id, first_name, last_name, and total.
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate total cost using aggregation
    const totalResult = await Cost.aggregate([
      { $match: { userid: req.params.id } },
      { $group: { _id: null, total: { $sum: '$sum' } } }
    ]);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      total
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

