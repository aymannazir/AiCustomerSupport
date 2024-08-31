const express = require('express');
const router = express.Router();

let waitlistCount = 0; // Initial count

// Route to get the current count
router.get('/count', (req, res) => {
  res.json({ count: waitlistCount });
});

// Route to increment the count
router.post('/join', (req, res) => {
  waitlistCount += 1;
  res.json({ count: waitlistCount });
});

module.exports = router;
