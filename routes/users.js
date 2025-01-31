const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cost = require('../models/Cost');

// הוספת משתמש חדש
router.post('/add', async (req, res) => {
  try {
    const { id, first_name, last_name, birthday, marital_status } = req.body;

    // בדיקת שדות חובה
    if (!id || !first_name || !last_name || !birthday || !marital_status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // יצירת משתמש חדש
    const newUser = new User({
      id,
      first_name,
      last_name,
      birthday,
      marital_status
    });

    await newUser.save();
    res.json(newUser);
  } catch (err) {
    console.error('Error adding user:', err);
    if (err.code === 11000) {
      res.status(400).json({ error: 'User ID already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// שליפת פרטי משתמש לפי ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // חישוב עלות כוללת
    const totalCost = await Cost.aggregate([
      { $match: { userid: req.params.id } },
      { $group: { _id: null, total: { $sum: '$sum' } } }
    ]);

    res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age, // הגיל מחושב על ידי ה-schema
      total_cost: totalCost.length > 0 ? totalCost[0].total : 0
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
