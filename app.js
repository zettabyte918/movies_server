const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(cors()); // Enable CORS for all routes
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (make sure MongoDB is running)
mongoose.connect("mongodb://localhost:27017/mohammed_db_titleDes", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a mongoose schema
const entitySchema = new mongoose.Schema({
  title: String,
  description: String,
});

// Create a mongoose model
const Entity = mongoose.model("Entity", entitySchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up routes

// Create
app.post("/entities", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newEntity = await Entity.create({ title, description });
    res.status(201).json(newEntity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read all
app.get("/entities", async (req, res) => {
  try {
    const entities = await Entity.find();
    res.status(200).json(entities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read one
app.get("/entities/:id", async (req, res) => {
  try {
    const entity = await Entity.findById(req.params.id);
    res.status(200).json(entity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
app.put("/entities/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedEntity = await Entity.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    res.status(200).json(updatedEntity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
app.delete("/entities/:id", async (req, res) => {
  try {
    await Entity.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the provided credentials match the hardcoded values
  if (email === "admin@gmail.com" && password === "123456") {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
