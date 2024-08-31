const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const waitlistRoutes = require('./api/waitlist/join'); // Import your route file

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Use the waitlist routes
app.use('/api/waitlist', waitlistRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
