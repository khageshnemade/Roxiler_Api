const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const Product = require("./Models/Product");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const PORT = process.env.PORT || 5000;

//MongoDb COnnection
mongoose.connect("mongodb://localhost:27017/RoxilerDB");

app.get("/init", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const json = response.data;
    await Product.insertMany(json);

    res
      .status(200)
      .send("Database initialized successfully with provided json");
  } catch (error) {
    res.status(500).send("Failed to inialized database");
  }
});

// Helper function to get month number from month name
const getMonthNumber = (monthName) =>
  ({
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  }[monthName.toLowerCase()]);

// Helper function to fetch products by month
const getProductsByMonth = async (
  month,
  search = "",
  page = "",
  perPage = ""
) => {
  // Convert the month to a number
  const monthNumber = getMonthNumber(month);

  // Build the filter for month
  const filter = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
  };

  // Add search conditions if a search query is provided
  if (search) {
    const searchConditions = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
    const searchNumber = parseFloat(search);
    if (!isNaN(searchNumber)) {
      searchConditions.push({ price: searchNumber });
    }
    filter.$or = searchConditions;
  }

  // Pagination logic
  const skip = (parseInt(page) - 1) * parseInt(perPage);
  const limit = parseInt(perPage);

  // Fetch products and total count with filters
  const products = await Product.find(filter).skip(skip).limit(limit);
  const totalProducts = await Product.countDocuments(filter);

  return { products, totalProducts };
};

app.get("/find", async (req, res) => {
  try {
    const { month = "March", search = "", page = 1, perPage = 10 } = req.query;
    const { products, totalProducts } = await getProductsByMonth(
      month,
      search,
      page,
      perPage
    );

    // Send the response
    res.status(200).json({
      page: parseInt(page),
      perPage: parseInt(perPage),
      totalProducts,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products");
  }
});

// Helper function to calculate statistics
const getStatistics = (products) =>
  products.reduce(
    (acc, product) => {
      if (product.sold) {
        acc.TotalItems++;
        acc.TotalSale += product.price;
      } else {
        acc.notSale++;
      }
      return acc;
    },
    { TotalSale: 0, TotalItems: 0, notSale: 0 }
  );

// Helper function to count price ranges
const getPriceRangeCounts = (products) => {
  // Initialize the price range counts
  const priceRangeCounts = {
    "0-100": 0,
    "101-200": 0,
    "201-300": 0,
    "301-400": 0,
    "401-500": 0,
    "501-600": 0,
    "601-700": 0,
    "701-800": 0,
    "801-900": 0,
    "901-above": 0,
  };

  // Iterate over each product and count prices in their respective range
  products.forEach(({ price }) => {
    if (price <= 100) priceRangeCounts["0-100"]++;
    else if (price <= 200) priceRangeCounts["101-200"]++;
    else if (price <= 300) priceRangeCounts["201-300"]++;
    else if (price <= 400) priceRangeCounts["301-400"]++;
    else if (price <= 500) priceRangeCounts["401-500"]++;
    else if (price <= 600) priceRangeCounts["501-600"]++;
    else if (price <= 700) priceRangeCounts["601-700"]++;
    else if (price <= 800) priceRangeCounts["701-800"]++;
    else if (price <= 900) priceRangeCounts["801-900"]++;
    else priceRangeCounts["901-above"]++;
  });

  return priceRangeCounts;
};

// Helper function to count categories
const getCategoryCounts = (products) => {
  // Initialize an empty object to hold the category counts
  const categoryCounts = {};

  // Iterate over each product and count occurrences of each category
  products.forEach(({ category }) => {
    if (category) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  });

  return categoryCounts;
};

// API for statistics
app.get("/statistics", async (req, res) => {
  try {
    const { month = "January" } = req.query;
    const products = (await getProductsByMonth(month)).products;

    let stats = { TotalSale: 0.0, TotalItems: 0, notSale: 0 };
    products.forEach((product) => {
      if (product["sold"]) {
        stats["TotalItems"]++;
        stats["TotalSale"] += product["price"];
      } else {
        stats["notSale"]++;
      }
    });

    res.status(200).send(stats);
  } catch (error) {
    res.status(500).send("Error fetching statistics" + error);
  }
});

// API for bar chart data
app.get("/bar_chart", async (req, res) => {
  try {
    const { month = "January" } = req.query;
    const products = (await getProductsByMonth(month)).products;

    const priceRanges = getPriceRangeCounts(products);
    res.status(200).send(priceRanges);
  } catch (error) {
    res.status(500).send("Error fetching bar chart data");
  }
});

// API for pie chart data
app.get("/pie_chart", async (req, res) => {
  try {
    const { month = "January" } = req.query;
    const products = (await getProductsByMonth(month)).products ;

    const categoryJson = getCategoryCounts(products);
    res.status(200).send(categoryJson);
  } catch (error) {
    res.status(500).send("Error fetching pie chart data");
  }
});

// Combined API to fetch all data
app.get("/combined_data", async (req, res) => {
  try {
    const { month = "", search = "", page = 1, perPage = 10 } = req.query;
    const { products, totalProducts } = await getProductsByMonth(
      month,
      search,
      page,
      perPage
    );
    let productsAll = (await getProductsByMonth(month)).products;
    const { productsTotal } = await getProductsByMonth(month);
    const stats = getStatistics(productsAll);
    const categoryJson = getCategoryCounts(productsAll);
    const priceRanges = getPriceRangeCounts(productsAll);
    res.status(200).json({
      products: products,
      totalProducts: totalProducts,

      statistics: stats,
      barChart: priceRanges,
      pieChart: categoryJson,
    });
  } catch (error) {
    res.status(500).send("Error fetching combined data" + error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
