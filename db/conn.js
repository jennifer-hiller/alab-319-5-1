import "dotenv/config";
import mongoose from "mongoose";

// Connect to MongoDB
await mongoose.connect(process.env.ATLAS_URI);
console.log("Connected to MongoDB");
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
