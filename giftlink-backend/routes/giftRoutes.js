const express = require("express");
const router = express.Router();
const connectToDatabase = require("../models/db");

router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const collection = db.collection("gifts");

    const gifts = await collection.find().toArray();

    res.json({ gifts });
  } catch (e) {
    console.error("Error fetching gifts:", e);
    res.status(500).send("Error fetching gifts");
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Task 1: Connect to MongoDB and store connection to db constant
    const db = await connectToDatabase();

    // Task 2: use the collection() method to retrieve the gift collection
    const collection = db.collection("gift");

    const id = req.params.id;

    // Task 3: Find a specific gift by ID using the collection.fineOne method and store in constant called gift
    const gift = await collection.findOne({ id: id });

    if (!gift) {
      return res.status(404).send("Gift not found");
    }

    res.json(gift);
  } catch (e) {
    console.error("Error fetching gift:", e);
    res.status(500).send("Error fetching gift");
  }
});

// Add a new gift
router.post("/", async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("gifts");
    const gift = await collection.insertOne(req.body);

    res.status(201).json(gift.ops[0]);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
