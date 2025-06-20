require("dotenv").config();
const express = require("express");
const axios = require("axios");
const logger = require("./logger");
const expressPino = require("express-pino-logger")({ logger });
const natural = require("natural");

// Task 2: initialize the express server
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(expressPino);

app.post("/sentiment ", async (req, res) => {
  const { sentence } = req.query;

  if (!sentence) {
    logger.error("No sentence provided");
    return res.status(400).json({ error: "No sentence provided" });
  }

  // Initialize the sentiment analyzer with the Natural's PorterStemmer and "English" language
  const Analyzer = natural.SentimentAnalyzer;

  // PorterStemmer to reduce words to roots (e.g., "runs" → "run")
  const stemmer = natural.PorterStemmer;
  const analyzer = new Analyzer("English", stemmer, "afinn"); // AFINN assigns scores to words.

  // Perform sentiment analysis
  try {
    const analysisResult = analyzer.getSentiment(sentence.split(" "));

    let sentiment = "neutral";
    if (analysisResult > 0) {
      sentiment = "positive";
    } else if (analysisResult < 0) {
      sentiment = "negative";
    }

    // Logging the result
    logger.info(`Sentiment analysis result: ${analysisResult}`);

    res
      .status(200)
      .json({ sentimentScore: analysisResult, sentiment: sentiment });
  } catch (error) {
    logger.error(`Error performing sentiment analysis: ${error}`);
    res.status(500).json({ message: "Error performing sentiment analysis" });
  }
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
