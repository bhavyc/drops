const mongoose = require("mongoose");
const Drop = require("./models/FruitDrop"); // apna path check karo

// DB Connection
mongoose.connect("mongodb://localhost:27017/drop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const drops = [
  {
    title: "Fresh Mangoes",
    description: "Get fresh Alphonso mangoes from Maharashtra.",
    image: "https://www.shutterstock.com/image-photo/fresh-mango-on-tree-garden-260nw-2617161019.jpg",  
    startTime: new Date("2025-09-15T10:00:00Z"),
    endTime: new Date("2025-09-20T18:00:00Z"),
    featured: true,
    price: 499,
    claimedBy: [],
  },
  {
    title: "Organic Apples",
    description: "Red delicious apples, straight from Himachal.",
    image: "https://www.shutterstock.com/image-photo/fresh-mango-on-tree-garden-260nw-2617161019.jpg",  
    startTime: new Date("2025-09-16T09:00:00Z"),
    endTime: new Date("2025-09-22T20:00:00Z"),
    featured: false,
    price: 299,
    claimedBy: [],
  },
  {
    title: "Fresh Bananas",
    description: "Sweet bananas from Kerala farms.",
    image: "https://www.shutterstock.com/image-photo/fresh-mango-on-tree-garden-260nw-2617161019.jpg",    
    startTime: new Date("2025-09-17T08:00:00Z"),
    endTime: new Date("2025-09-23T19:00:00Z"),
    featured: false,
    price: 149,
    claimedBy: [],
  }
];

// Seed Function
const seedDrops = async () => {
  try {
    await Drop.deleteMany(); // purane drops delete kar de (optional)
    await Drop.insertMany(drops);
    console.log("Drops seeded successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.log("Seeder error:", err);
  }
};

seedDrops();
