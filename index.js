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


const patientSchema = new mongoose.Schema({
    patientId: String,
    surname: String,
    othernames: String,
    gender: String,
    phoneNumber: String,
    residentialAddress: String,
    emergency: {
      name: String,
      contact: String,
      relationship: String
    }
  });
  
  const Patient = mongoose.model('Patient', patientSchema);

// Register a new patient
app.post('/registerPatient', async (req, res) => {
    try {
      const { patientId, surname, othernames, gender, phoneNumber, residentialAddress, emergency } = req.body;
      const patient = new Patient({
        patientId,
        surname,
        othernames,
        gender,
        phoneNumber,
        residentialAddress,
        emergency
      });
  
      await patient.save();
      res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Add more routes for other functionalities...
  

