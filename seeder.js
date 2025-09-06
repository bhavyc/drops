const mongoose = require("mongoose");
const Drop = require("./models/FruitDrop");
const Claim = require("./models/Claim");

mongoose.connect("mongodb://127.0.0.1:27017/drop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const drops = [
  {
    title: "Mango Madness",
    description: "Get the juiciest Alphonso mangoes fresh from Ratnagiri!",
    image: "https://picsum.photos/seed/mango/400/250",
    startTime: new Date(Date.now()), // available now
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
    featured: true,
  },
  {
    title: "Apple Fiesta",
    description: "Crispy Kashmiri apples at half the price!",
    image: "https://picsum.photos/seed/apple/400/250",
    startTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // starts in 1h
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // ends in 4h
    featured: false,
  },
  {
    title: "Banana Bonanza",
    description: "Organic bananas rich in potassium and vitamins.",
    image: "https://picsum.photos/seed/banana/400/250",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // started 2h ago
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // ends in 3h
    featured: true,
  },
  {
    title: "Grapes Galaxy",
    description: "Sweet green grapes directly from Nashik farms.",
    image: "https://picsum.photos/seed/grapes/400/250",
    startTime: new Date(Date.now() + 30 * 60 * 1000), // starts in 30 min
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // ends in 5h
    featured: false,
  },
];

async function seed() {
  try {
    await Drop.deleteMany({});
    await Drop.insertMany(drops);
    console.log("Drops seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

seed();
