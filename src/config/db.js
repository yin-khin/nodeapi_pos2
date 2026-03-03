// const mysql = require('mysql2/promise');

// var db = mysql.createPool({
//     host : 'localhost',
//     user : 'root',
//     password : '',
//     database : 'backend5',
//     port : 3306,
//     waitForConnections : true,
//     connectionLimit : 1000
    
// });

// module.exports = db;

// const mysql = require("mysql2/promise");
// require("dotenv").config();

// const db = mysql.createPool({
//   uri: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
//   waitForConnections: true,
//   connectionLimit: 10,
// });

// module.exports = db;

const mysql = require("mysql2/promise");
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing. Check .env or Render env vars.");
}

// parse mysql://user:pass@host:port/dbname
const url = new URL(databaseUrl);

const db = mysql.createPool({
  host: url.hostname,
  port: url.port ? Number(url.port) : 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace("/", ""),
  waitForConnections: true,
  connectionLimit: 10,

  // 👉 only use if cloud DB requires SSL
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = db;