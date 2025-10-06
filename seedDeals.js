require('dotenv').config();
const mongoose = require('mongoose');
const NewDeal = require('./models/NewDeal'); // adjust path if needed

// Connect to DB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/my_drops';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const now = new Date();

const deals = [
  {
    title: "Mango",
    description: "Fresh and juicy mangoes at 20% off!",
    price: 100,
  
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDh6RmUj-ZuZw_77mK_iQzGxg1R46_hVjSxg&s",
   
    featured: true,
  },
  {
    title: "Apple",
    description: "Crispy apples for your healthy snacks.",
    price: 80,
   
    image: "https://www.collinsdictionary.com/images/full/apple_158989157.jpg",
    featured: true,
  },
  {
    title: "Banana",
    description: "Sweet bananas at unbeatable prices.",
    price: 50,
    featured: true,
    image: "https://nutritionsource.hsph.harvard.edu/wp-content/uploads/2018/08/bananas-1354785_1920.jpg",
    
  }
];

// Seed function
async function seedDeals() {
  try {
    await NewDeal.deleteMany(); // optional: clear existing deals
    await NewDeal.insertMany(deals);
    console.log('✅ Deals seeded successfully');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding deals:', err);
  }
}

seedDeals();
