const { Pool } = require("pg");
require("dotenv").config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },

  family: 6
});

db.connect()
  .then(() => {
    console.log("✅ PostgreSQL Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ PostgreSQL Connection Error:", err.message);
  });

module.exports = db;