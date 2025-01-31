const express = require('express');
const router = express.Router();
const Cost = require('../models/Cost');
const Report = require('../models/Report');

// הוספת פריט עלות
router.post('/add', async (req, res) => {
    try {
        const { description, category, userid, sum, date } = req.body;

        // בדיקת שדות חובה
        if (!description || !category || !userid || !sum) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (sum <= 0) {
            return res.status(400).json({ error: 'Sum must be a positive number' });
        }


        // יצירת פריט עלות חדש
        const newCost = new Cost({
            description,
            category,
            userid,
            sum,
            date: date || Date.now() // שימוש בתאריך נוכחי אם לא נשלח תאריך
        });

        await newCost.save();
        res.json(newCost);
    } catch (err) {
        console.error('Error adding cost:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/report', async (req, res) => {
     try {
        const { userId, month, year } = req.query;

        // Validate input
        if (!userId || !month || !year) {
            return res.status(400).json({ error: 'userId, month, and year are required' });
        }

        // Ensure valid month and year
        if (month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
            return res.status(400).json({ error: 'Invalid month or year' });
        }

        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        // Find costs for the user within the date range
        const costs = await Cost.find({
            userId,
            date: { $gte: startDate, $lt: endDate },
        });

        res.json({ userId, costs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
