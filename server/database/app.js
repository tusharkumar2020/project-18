const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3030;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // This is useful for JSON POST data

// Read local JSON files
const reviews_data = JSON.parse(fs.readFileSync("data/reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("data/dealerships.json", 'utf8'));

// Connect to MongoDB
// Use localhost for local development outside Docker, mongo_db for Docker container networking
const mongoHost = process.env.MONGO_HOST || 'localhost';
mongoose.connect(`mongodb://${mongoHost}:27017/`, { dbName: 'dealershipsDB' });

// Models
const Reviews = require('./review');
const Dealerships = require('./dealership');

// Populate the DB (initial setup only)
(async () => {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data['reviews']);

    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data['dealerships']);
  } catch (error) {
    console.error('Error populating DB:', error);
  }
})();

// ==========================
// Routes
// ==========================

// Root route
app.get('/', (req, res) => {
  res.send("Welcome to the Mongoose API");
});

// All reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Reviews by dealership ID
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// All dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealerships = await Dealerships.find();
    res.json(dealerships);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// Dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const dealerships = await Dealerships.find({ state: req.params.state });
    res.json(dealerships);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships by state' });
  }
});

// Dealership by ID
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealership = await Dealerships.findOne({ id: parseInt(req.params.id) });
    if (dealership) {
      res.json(dealership);
    } else {
      res.status(404).json({ error: 'Dealership not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealership by id' });
  }
});

// Insert a new review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const latestReview = await Reviews.findOne().sort({ id: -1 });
    const new_id = latestReview ? latestReview.id + 1 : 1;

    const review = new Reviews({
      id: new_id,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year,
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});