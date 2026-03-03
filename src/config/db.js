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

module.exports = db;

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

// require("dotenv").config();
// const { Sequelize } = require("sequelize");

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL missing");
// }

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: "mysql",
//   logging: false,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });

// module.exports = sequelize;