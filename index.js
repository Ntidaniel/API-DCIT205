const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/ugmc', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Mongoose schemas
const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true,
  },
  surname: String,
  othernames: String,
  gender: String,
  phoneNumber: String,
  residentialAddress: String,
  emergency: {
    name: String,
    contact: String,
    relationship: String,
  },
});

const encounterSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  dateAndTime: {
    type: Date,
    default: Date.now,
  },
  encounterType: {
    type: String,
    enum: ['Emergency', 'OPD', 'Specialist Care'],
    required: true,
  },
});

const vitalsSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  bloodPressure: String,
  temperature: String,
  pulse: String,
  sp02: String,
  recordedAt: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model('Patient', patientSchema);
const Encounter = mongoose.model('Encounter', encounterSchema);
const Vitals = mongoose.model('Vitals', vitalsSchema);

// Middleware to parse JSON
app.use(bodyParser.json());

// Register a new patient
app.post('/registerPatient', async (req, res) => {
  try {
    const { patientId, surname, othernames, gender, phoneNumber, residentialAddress, emergency } = req.body;

    if (!patientId || !surname || !othernames || !gender || !phoneNumber || !residentialAddress || !emergency) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingPatient = await Patient.findOne({ patientId });
    if (existingPatient) {
      return res.status(409).json({ error: 'Patient with this ID already exists' });
    }

    const patient = new Patient({
      patientId,
      surname,
      othernames,
      gender,
      phoneNumber,
      residentialAddress,
      emergency,
    });

    await patient.save();

    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start an encounter for a patient
app.post('/startEncounter', async (req, res) => {
  try {
    const { patientId, encounterType } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const encounter = new Encounter({
      patientId: patient._id,
      encounterType,
    });

    await encounter.save();

    res.status(201).json({ message: 'Encounter started successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit patient vitals
app.post('/submitVitals', async (req, res) => {
  try {
    const { patientId, bloodPressure, temperature, pulse, sp02 } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const vitals = new Vitals({
      patientId: patient._id,
      bloodPressure,
      temperature,
      pulse,
      sp02,
    });

    await vitals.save();

    res.status(201).json({ message: 'Vitals submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// View a list of patients
app.get('/patients', async (req, res) => {
  try {
    // Retrieve a list of patients from the database
    const patients = await Patient.find();

    // Respond with the list of patients
    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
