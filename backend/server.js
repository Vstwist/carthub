const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const cartRoutes = require("./routes/cartRoutes");

require("./config/db");

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use("/api/cart", cartRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
 
const productRoutes = require("./routes/productRoutes");

app.use("/api/products", productRoutes);
  
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);


app.get("/", (req, res) => {
    res.send("Welcome to V's Twist Backend!");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});