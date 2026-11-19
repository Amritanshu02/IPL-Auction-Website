const mongoose = require("mongoose");

const db = mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the mongodb database");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.name);
  });

module.exports = db;
