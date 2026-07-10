import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart() {
  const [cart, setCart] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchCart = () => {
    axios
      .get(`http://localhost:5000/api/cart/${user.id}`)
      .then((response) => {
        setCart(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
      });
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, []);

  const increaseQuantity = (id) => {
    axios
      .put(`http://localhost:5000/api/cart/increase/${id}`)
      .then(() => {
        fetchCart();
      });
  };

  const decreaseQuantity = (id) => {
    axios
      .put(`http://localhost:5000/api/cart/decrease/${id}`)
      .then(() => {
        fetchCart();
      });
  };

  const removeItem = (id) => {
    axios
      .delete(`http://localhost:5000/api/cart/remove/${id}`)
      .then(() => {
        fetchCart();
      });
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div
      style={{
        padding: "30px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>
        🛒 My Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <h2>Your cart is empty</h2>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                background: "#fff",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.name}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div style={{ flex: 1 }}>
                <h2>{item.name}</h2>

                <p>{item.description}</p>

                <h3>₹{item.price}</h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "15px",
                  }}
                >
                  <button
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    -
                  </button>

                  <h3>{item.quantity}</h3>

                  <button
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    +
                  </button>
                </div>

                <h3
                  style={{
                    marginTop: "15px",
                  }}
                >
                  Subtotal ₹
                  {Number(item.price) *
                    item.quantity}
                </h3>

                <button
                  onClick={() =>
                    removeItem(item.id)
                  }
                  style={{
                    marginTop: "15px",
                    background: "red",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "10px",
              textAlign: "right",
            }}
          >
            <h2>Total : ₹{total}</h2>

            <button
            onClick={() => navigate("/checkout")}
            style={{
            padding: "15px 30px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "18px",
             }}
             >
            Proceed to Checkout
            </button>
            
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;