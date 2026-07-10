const express = require("express");
const router = express.Router();

console.log("✅ cartRoutes loaded");

const {
  addToCart,
  getCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} = require("../controllers/cartController");

router.post("/add", addToCart);
router.get("/:user_id", getCart);
router.put("/increase/:id", increaseQuantity);
router.put("/decrease/:id", decreaseQuantity);
router.delete("/remove/:id", removeFromCart);

module.exports = router;