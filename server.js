// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // Import body-parser

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Verification token
const VERIFY_TOKEN = "i_verify_im_him";

// Instagram Webhook Route (GET for verification)
app.get('/webhook', (req, res) => {
    const verifyToken = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (verifyToken === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    } else {
        return res.status(403).send('Error, invalid token');
    }
});

// Instagram Webhook Route (POST for incoming messages)
app.post('/webhook', (req, res) => {
    const data = req.body;
    // Log the incoming webhook event
    console.log(`Received webhook event:`, data);
    // Process the event (e.g., store in database, perform an action)
    return res.status(200).json({ status: 'received' });
});

// Handle all other requests (React app)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Port configuration
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
