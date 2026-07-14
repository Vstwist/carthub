import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiArrowRight } from "react-icons/fi";

function OrderSuccess() {
  const navigate = useNavigate();

  // Generate a random luxury order reference
  const orderId = useRef(
    "VT-" + Math.floor(100000 + Math.random() * 900000)
  );

  useEffect(() => {
    document.title = "Order Success | V's Twist";
  }, []);

  return (
    <div style={containerPageStyle}>
      <div className="card" style={successCardStyle}>
        {/* Animated green success check icon */}
        <div style={iconContainerStyle}>
          <FiCheckCircle size={56} color="#10B981" />
        </div>

        {/* Thank You Header */}
        <h1 style={thankYouHeadingStyle}>Thank You for Your Order!</h1>
        
        <p style={subtextStyle}>
          Your request has been received. We are preparing to handcraft your beautiful bouquet.
        </p>

        {/* Order ID display */}
        <div style={orderIdBoxStyle}>
          <span style={orderIdLabelStyle}>Order Reference</span>
          <strong style={orderIdValueStyle}>{orderId.current}</strong>
        </div>

        <p style={deliveryNoticeStyle}>
          Our team will contact you shortly via phone/email to confirm the delivery schedule.
        </p>

        {/* Decorative bouquet illustration */}
        <div style={bouquetIllustrationStyle}>
          <span role="img" aria-label="bouquet" style={flowerEmojiStyle}>
            💐✨🌸
          </span>
        </div>

        {/* Continue Shopping button */}
        <button
          onClick={() => navigate("/products")}
          className="btn-primary"
          style={continueBtnStyle}
        >
          <FiShoppingBag /> Continue Shopping <FiArrowRight />
        </button>
      </div>
    </div>
  );
}

// Styling definitions
const containerPageStyle = {
  background: "linear-gradient(135deg, #FAF8F6 0%, #F5F1FF 100%)",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
};

const successCardStyle = {
  background: "#FFF",
  padding: "50px 40px",
  textAlign: "center",
  width: "100%",
  maxWidth: "520px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  animation: "fadeIn 0.6s ease-out",
};

const iconContainerStyle = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  background: "#D1FAE5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "24px",
};

const thankYouHeadingStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "30px",
  color: "var(--text)",
  marginBottom: "12px",
};

const subtextStyle = {
  fontSize: "14px",
  color: "var(--text-secondary)",
  lineHeight: "1.6",
  marginBottom: "24px",
  maxWidth: "400px",
};

const orderIdBoxStyle = {
  background: "var(--bg-cream)",
  border: "1px solid var(--border)",
  padding: "12px 24px",
  borderRadius: "var(--radius-sm)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  marginBottom: "24px",
  width: "100%",
};

const orderIdLabelStyle = {
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  color: "var(--text-secondary)",
  fontWeight: "700",
};

const orderIdValueStyle = {
  fontSize: "20px",
  color: "var(--primary)",
  letterSpacing: "1px",
};

const deliveryNoticeStyle = {
  fontSize: "12px",
  color: "var(--text-secondary)",
  lineHeight: "1.5",
  marginBottom: "30px",
  maxWidth: "360px",
};

const bouquetIllustrationStyle = {
  fontSize: "48px",
  marginBottom: "32px",
  userSelect: "none",
  animation: "float 3s ease-in-out infinite",
};

const flowerEmojiStyle = {
  display: "inline-block",
  filter: "drop-shadow(0 10px 15px rgba(139, 92, 246, 0.15))",
};

const continueBtnStyle = {
  width: "100%",
  padding: "16px",
  fontSize: "15px",
};

export default OrderSuccess;