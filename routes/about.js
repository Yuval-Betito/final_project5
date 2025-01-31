
const express = require('express');
const router = express.Router();


const teamMembers = [
    { first_name: 'Yuval', last_name: 'Betito' },
    { first_name: 'Hen', last_name: 'Ben Gigi' }
];

router.get('/', (req, res) => {
    res.json(teamMembers);
});

module.exports = router;
