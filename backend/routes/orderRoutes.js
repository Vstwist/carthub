const express = require("express");
console.log("✅ orderRoutes loaded");
const router = express.Router();

const { placeOrder } = require("../controllers/orderController");

router.post("/place", placeOrder);

module.exports = router;
