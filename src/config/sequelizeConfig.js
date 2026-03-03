// require('dotenv').config();
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(
//   process.env.DB_NAME || 'backend_pos_db',
//   process.env.DB_USER || 'root',
//   process.env.DB_PASSWORD || '',
//   {
//     host: process.env.DB_HOST || 'localhost',
//     port: process.env.DB_PORT || 3306,
//     dialect: process.env.DB_DIALECT || 'mysql'
//   }
// );

// module.exports = sequelize;

require("dotenv").config();
const { Sequelize } = require("sequelize");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Set it in Railway Variables.");
}

// Debug (no password)
try {
  const u = new URL(process.env.DATABASE_URL);
  console.log("✅ DB TARGET:", { host: u.hostname, port: u.port, db: u.pathname });
} catch (_) {}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false,

  // Railway MySQL often requires SSL via proxy
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },

  pool: {
    max: 10,
    min: 0,
    idle: 10000,
  },
});

module.exports = sequelize;