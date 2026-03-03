const express = require("express");
const cors = require("cors");
const { BakongKHQR, MerchantInfo } = require("bakong-khqr");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create KHQR payload API
app.post("/api/khqr", (req, res) => {
  try {
    const { amount, orderNo } = req.body;

    const amt = Number(amount || 0);
    if (!Number.isFinite(amt) || amt <= 0) {
      return res.status(400).json({ ok: false, message: "amount must be > 0" });
    }

    // ✅ Replace with your real merchant info
    const merchant = new MerchantInfo(
      "YOUR_BAKONG_ID",
      "Restro POS",
      "Phnom Penh"
    );

    // NOTE: method name depends on package version.
    // If this line errors, paste error and I’ll change the call.
    const result = BakongKHQR.generateMerchant(merchant, amt, String(orderNo || "INV"));

    const payload = result?.data || result?.qr || "";
    if (!payload) {
      return res.status(500).json({ ok: false, message: "Failed to generate KHQR" });
    }

    return res.json({ ok: true, payload });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
});

