import "./App.css";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import AddProduct from "./pages/AddProduct";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";


import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const showNavbar =
    location.pathname === "/products" ||
    location.pathname === "/cart" ||
    location.pathname === "/add-product";

  return (
    <div className="App">
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </div>
  );
}

export default App;