require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

// Database Configuration
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "farahalhasan",
  password: process.env.DB_PASSWORD || "f1a2r3a4h5!",
  database: process.env.DB_NAME || "auth_system",
});

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Improved Registration Endpoint
app.post("/register", async (req, res) => {
  const { username, password, role_id } = req.body;

  // Validate input
  if (!username || !password || !role_id) {
    return res.status(400).json({
      error: "Missing fields",
      required: ["username", "password", "role_id"],
    });
  }

  try {
    // Verify role exists first
    const roleCheck = await pool.query("SELECT id FROM roles WHERE id = $1", [
      role_id,
    ]);

    if (roleCheck.rows.length === 0) {
      return res.status(400).json({
        error: "Invalid role",
        message: "The specified role_id does not exist",
        available_roles: await getAvailableRoles(), // Helper function
      });
    }

    // Check username availability
    const userExists = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({
        error: "Username taken",
        message: "Please choose a different username",
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await pool.query(
      `INSERT INTO users (username, password, role_id)
       VALUES ($1, $2, $3)
       RETURNING id, username, role_id`,
      [username, hashedPassword, role_id]
    );

    res.status(201).json({
      success: true,
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error("Registration error:", err);

    // Handle specific PostgreSQL errors
    if (err.code === "23503") {
      // Foreign key violation
      return res.status(400).json({
        error: "Invalid role",
        message: "The specified role_id does not exist in roles table",
        suggestion: "First create the role or use an existing role_id",
      });
    }

    res.status(500).json({
      error: "Registration failed",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Helper function to get available roles
async function getAvailableRoles() {
  const result = await pool.query("SELECT id, name FROM roles");
  return result.rows;
}

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
