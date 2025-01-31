const express = require('express');
const router = express.Router();
const Cost = require('../models/Cost');
const Report = require('../models/Report');
const User = require('../models/User');

/**
 * Adds a new cost item for a user.
 * This route handles POST requests to add a new expense item to the database.
 *
 * @route POST /api/costs/add
 * @param {string} description - A brief description of the expense (e.g., "Groceries").
 * @param {string} category - The category of the expense (e.g., "Food", "Health").
 * @param {string} userid - The ID of the user making the expense.
 * @param {number} sum - The total amount of the expense (must be a positive number).
 * @param {string} [date] - The date of the expense. If not provided, the current date is used.
 * @returns {object} 201 - The newly created cost item.
 * @returns {Error} 400 - If required fields are missing or the sum is invalid.
 * @returns {Error} 500 - If there is a server error.
 */

router.post('/add', async (req, res) => {
    try {
        const { description, category, userid, sum, date } = req.body;

        const userExists = await User.findOne({ id: userid });
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Mandatory fields validation
        if (!description || !category || !userid || !sum) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (sum <= 0) {
            return res.status(400).json({ error: 'Sum must be a positive number' });
        }


        // Creating a new cost item
        const newCost = new Cost({
            description,
            category,
            userid,
            sum,
            date: date || Date.now() // Use the current date if not provided
        });

        await newCost.save();
        res.json(newCost);
    } catch (err) {
        console.error('Error adding cost:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Retrieves a monthly report of expenses for a specific user.
 * This route handles GET requests to retrieve the cost items for a specific user,
 * year, and month, and returns them grouped by category.
 *
 * @route GET /api/costs/report
 * @param {string} id - The ID of the user whose report is being fetched.
 * @param {number} year - The year for which the report is generated.
 * @param {number} month - The month for which the report is generated (1 = January, 12 = December).
 * @returns {object[]} 200 - A list of cost items grouped by category for the specified user, year, and month.
 * @returns {Error} 400 - If any required query parameters are missing or invalid.
 * @returns {Error} 404 - If no data is found for the specified user and date range.
 * @returns {Error} 500 - If there is a server error.
 */

router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;

        if (!id || !year || !month) {
            return res.status(400).json({ error: 'Missing parameters: id, year, month' });
        }

        const parsedYear = parseInt(year, 10);
        const parsedMonth = parseInt(month, 10);
        if (isNaN(parsedYear) || isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
            return res.status(400).json({ error: 'Invalid year or month' });
        }

        console.log(`Fetching report for User ID: ${id}, Year: ${year}, Month: ${month}`);

        // Calculating the date range for the requested month
        const startDate = new Date(parsedYear, parsedMonth - 1, 1);
        const endDate = new Date(parsedYear, parsedMonth, 31, 23, 59, 59, 999);

        console.log(`Start Date: ${startDate}, End Date: ${endDate}`);

        // Retrieving all expenses for the requested month
        const costs = await Cost.find({
            userid: id,
            date: { $gte: startDate, $lte: endDate }
        });

        console.log(`Fetched ${costs.length} cost items`);

        if (costs.length === 0) {
            return res.status(404).json({ message: 'No data found for the specified user and date range' });
        }

        // Organizing the data by categories
        const categorizedData = {};

        costs.forEach(cost => {
            if (!categorizedData[cost.category]) {
                categorizedData[cost.category] = {
                    total: 0,
                    items: []
                };
            }

            categorizedData[cost.category].total += cost.sum;
            categorizedData[cost.category].items.push({
                description: cost.description,
                sum: cost.sum,
                date: cost.date
            });
        });

        // Converting the object into a JSON list formatted according to the requested structure
        const reportData = Object.entries(categorizedData).map(([category, data]) => ({
            category: category,
            total: data.total,
            items: data.items
        }));

        console.log('Final Report Data:', reportData);

        res.json(reportData);
    } catch (err) {
        console.error('Error fetching report:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
