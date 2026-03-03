// require('dotenv').config();
// const express = require('express');
// const path = require('path');
// const userRoute = require('./src/route/userRoute');
// const runMigrations = require('./src/config/migrate');
// const schedule = require('node-schedule');
// const cors = require('cors');

// //import routes features
// const categoryRoute = require('./src/route/categoryRoute');
// const brandRoute = require('./src/route/brandRoute');
// const productRoute = require('./src/route/productRoute');
// const userRoutes = require('./src/route/userRoute');
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use('/assets', express.static(path.join(__dirname, 'assets')));

// // Routes
// userRoutes(app);
// categoryRoute(app);
// brandRoute(app);
// productRoute(app);

// const PORT = process.env.PORT || 3000;

// // Initialize database and start server
// const startServer = async () => {
//   try {
//     console.log('\n🚀 Starting server...');
    
//     // Run migrations on startup
//     await runMigrations();
    
//     // Start the server
//     app.listen(PORT, () => {
//       console.log(`\n✓ Server is running on http://localhost:${PORT}\n`);
//     });
//   } catch (error) {
//     console.error('\n✗ Failed to start server:', error.message);
//     process.exit(1);
//   }
// };

// // Start the application
// startServer();
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const runMigrations = require("./src/config/migrate");
const categoryRoute = require("./src/route/categoryRoute");
const brandRoute = require("./src/route/brandRoute");
const productRoute = require("./src/route/productRoute");
const userRoutes = require("./src/route/userRoute");

const { BakongKHQR, MerchantInfo } = require("bakong-khqr");

const app = express();

// Middleware (MUST be before routes that use req.body)
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// KHQR
app.post("/api/khqr", (req, res) => {
  try {
    const { amount, orderNo } = req.body;

    const amt = Number(amount || 0);
    if (!Number.isFinite(amt) || amt <= 0) {
      return res.status(400).json({ ok: false, message: "amount must be > 0" });
    }

    const merchant = new MerchantInfo("YOUR_BAKONG_ID", "Restro POS", "Phnom Penh");
    const result = BakongKHQR.generateMerchant(merchant, amt, String(orderNo || "INV"));

    const payload = result?.data || result?.qr || "";
    if (!payload) return res.status(500).json({ ok: false, message: "Failed to generate KHQR" });

    return res.json({ ok: true, payload });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
});

// Routes
userRoutes(app);
categoryRoute(app);
brandRoute(app);
productRoute(app);

const PORT = process.env.PORT || 3000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const startServer = async () => {
  try {
    console.log("\n🚀 Starting server...");

    // retry migrations (helps on cloud)
    for (let i = 1; i <= 5; i++) {
      try {
        await runMigrations();
        console.log("✅ Migrations done");
        break;
      } catch (e) {
        console.log(`⚠️ Migration attempt ${i} failed: ${e.message}`);
        if (i === 5) throw e;
        await sleep(3000);
      }
    }

    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();