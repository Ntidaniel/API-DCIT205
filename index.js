const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/ugmc', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse JSON
app.use(bodyParser.json());

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
