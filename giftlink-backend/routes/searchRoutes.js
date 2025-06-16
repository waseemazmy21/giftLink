const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        const { name, category, condition, age_years } = req.query;
        let query = {};
        
        if (name) {
            name = name.trim();
            query.name = { $regex: name, $options: "i" }; 
        }

        if (category) {
            query.category = category;
        }
        if (condition) {
            query.condition = condition;
        }
        if (age_years) {
            query.age_years = { $lte: parseInt(age_years) };
        }

        const gifts = await collection.find(query);

        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
