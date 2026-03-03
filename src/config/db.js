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

const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = db;