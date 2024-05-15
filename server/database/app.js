const express = require('express');
const mongoose = require('mongoose');
//const fs = require('fs');
const  cors = require('cors')
const app = express()
const port = 3030;

app.use(cors())
app.use(express.json());// 使用 express 内置的中间件来解析 JSON
//app.use(require('body-parser').urlencoded({ extended: false }));

//const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
//const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

//mongoose.connect("mongodb://mongo_db:27017/",{'dbName':'dealershipsDB'});
mongoose.connect("mongodb://mongo_db:27017/dealershipsDB",{
  useNewUrlParser: true,
  useUnifiedTopology:true
}).then(()=>{
  console.log("Connected to MongoDB successfully");
}).catch(err => {
  console.error("Error connecting to MongoDB", err);
});

const Reviews = require('./review');
const Dealerships = require('./dealership');
//const { error } = require('console');

//try {
//  Reviews.deleteMany({}).then(()=>{
//    Reviews.insertMany(reviews_data['reviews']);
//  });
//  Dealerships.deleteMany({}).then(()=>{
//    Dealerships.insertMany(dealerships_data['dealerships']);
//  });
//  
//} catch (error) {
//  res.status(500).json({ error: 'Error fetching documents' });
//}


// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API")
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents", error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({dealership: req.params.id});
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents by dealer", error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealerships.find();// 从数据库查询所有经销商
    res.json(dealers);// 返回查询结果
  } catch (error) {
    console.error("Error fetching dealership data", error); // 记录错误日志
    res.status(500).json({error: 'Error fetching dealership data'});// 返回错误响应
  }
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
  const state = req.params.state;
  if (!state) {
    return res.status(400).json({error: 'State parameter is required'});
  }
  try {
    const dealers = await Dealerships.find({state:state});//删掉了state的引号
    res.json(dealers);
  } catch (error) {
    console.error("Error fetching dealerships by state", error);
    res.status(500).json({error: 'Error fetching dealerships data by state'});
  }
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
  const id = req.params.id;
  if(!id){
    return res.status(400).json({ error: 'ID parameter is required' }); // 若未提供，返回 400 错误
  }
  try {
    const dealer = await Dealerships.findOne({ id: id });//id 字段不是 MongoDB 自动生成的 _id，则需要使用 findOne() 方法来进行查询
    //const dealer = await Dealerships.findById(id);
    if (dealer){
      res.json(dealer);
    } else {
      res.status(404).json({error:'Dealer Not Found!'})
    }
  } catch (error){
    console.error(`Error fetching dealership data by ID: ${id}`, error); // 记录错误日志
    res.status(500).json({error: 'Error fetching dealerships data by ID'})
  }
});

//Express route to insert review
app.post('/insert_review', async (req, res) => {
  const data = req.body;// 直接从 req.body 获取数据
  const lastReview = await Reviews.findOne().sort( { id: -1 } )//使用 -1 作为排序参数，记录将按照该字段的值从大到小排序
  let new_id = lastReview ? lastReview.id + 1 : 1;

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

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
		console.log('Error inserting review',error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
