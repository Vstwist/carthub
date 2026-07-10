import { useNavigate } from "react-router-dom";

function OrderSuccess() {

  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5"
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "10px",
          textAlign: "center",
          width: "500px",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)"
        }}
      >
        <h1 style={{ color: "green" }}>
          🎉 Order Placed Successfully
        </h1>

        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          Thank you for shopping with <b>CartHub</b>.
        </p>

        <p>
          Your order has been received.
        </p>

        <p>
          We will contact you soon regarding your order.
        </p>

        <button
          onClick={() => navigate("/products")}
          style={{
            marginTop: "30px",
            padding: "15px 30px",
            background: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Continue Shopping
        </button>

      </div>
    </div>
  );
}

export default OrderSuccess;