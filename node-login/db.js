const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database");
    return client;
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1); // Exit with failure
  }
}

// Immediately invoke the connection function
connectDB();

module.exports = client;
