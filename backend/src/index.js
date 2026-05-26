const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

async function start() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log("Connecté à MongoDB");

  const db = client.db("shop");
  app.locals.db = db;

  app.use(cors());
  app.use(express.json());

  app.get("/api/products", async (req, res) => {
    try {
      const db = app.locals.db;

      // Extracting query parameters
      let {
        page = 1,
        limit = 10,
        category,
        sort = "createdAt",
        order = "desc",
      } = req.query;

      // Conversion to numbers
      page = parseInt(page);
      limit = parseInt(limit);

      const skip = (page - 1) * limit;
      const query = {};
      const sortOptions = {};

      if (category) query.category = category; // Filter by category
      sortOptions[sort] = order === "desc" ? -1 : 1; // Sorting options

      // Execution of the query
      const products = await db
        .collection("products")
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .toArray();

      // Total count for pagination
      const total = await db.collection("products").countDocuments(query);

      res.json({
        products,
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
          limit,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.listen(PORT, () =>
    console.log("Serveur démarre sur http://localhost:" + PORT),
  );
}

start().catch((err) => {
  console.error("Erreur de connexion MongoDB :", err.message);
  process.exit(1);
});
