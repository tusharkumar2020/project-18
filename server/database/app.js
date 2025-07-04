const express = require('express');
const mongoose = require('mongoose');
const Dealerships = require('./dealership');
const Reviews = require('./review');
const reviews_data = require('./reviews.json');
const dealerships_data = require('./dealerships.json');

const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/car_dealership', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');

  // Insert seed data
  try {
    Reviews.deleteMany({}).then(() => {
      Reviews.insertMany(reviews_data.reviews);
    });

    Dealerships.deleteMany({}).then(() => {
      Dealerships.insertMany(dealerships_data.dealerships);
    });
  } catch (error) {
    console.error('Error inserting documents:', error);
  }
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// GET all dealerships
app.get('/dealerships', async (req, res) => {
  try {
    const dealerships = await Dealerships.find();
    res.json(dealerships);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dealerships' });
  }
});

// GET all reviews
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await Reviews.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// GET review by ID
app.get('/reviews/:id', async (req, res) => {
  try {
    const review = await Reviews.findById(req.params.id);
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// POST new review
app.post('/insert_review', async (req, res) => {
  try {
    const data = req.body;

    const newReview = new Reviews({
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year,
    });

    await newReview.save();
    res.json({ message: 'Review inserted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to insert review' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
