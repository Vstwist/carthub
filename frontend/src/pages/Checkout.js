import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiTruck, FiLock, FiChevronRight } from "react-icons/fi";

function Checkout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cash on delivery
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    document.title = "Secure Checkout | V's Twist";
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/cart/${user.id}`)
      .then((res) => {
        setCart(res.data);
      })
      .catch((err) => {
        console.error("Error fetching cart for checkout:", err);
      });
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // Shipping estimation
  const shipping = subtotal > 1000 ? 0 : subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async (e) => {
    if (e) e.preventDefault();

    if (
      !formData.customer_name ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      alert("Please fill in all delivery details");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/place`,
        {
          user_id: user.id,
          customer_name: formData.customer_name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        }
      );

      alert(response.data.message);
      navigate("/order-success");
    } catch (err) {
      console.error(err);
      alert("Order placement failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#FAF8F6", minHeight: "100vh", padding: "60px 0 80px" }}>
      <div className="container">
        {/* Breadcrumb / Back button */}
        <div style={checkoutHeaderStyle}>
          <Link to="/cart" style={backLinkStyle}>
            <FiArrowLeft /> Back to Cart
          </Link>
          <div style={breadcrumbStyle}>
            <span>Cart</span> <FiChevronRight size={12} /> <span style={{ fontWeight: 700, color: "var(--primary)" }}>Checkout</span> <FiChevronRight size={12} /> <span>Success</span>
          </div>
        </div>

        <div style={layoutGridStyle}>
          {/* Left Column: Form */}
          <div style={formColumnStyle}>
            <div className="card" style={checkoutCardStyle}>
              <h2 style={sectionTitleStyle}><FiTruck size={20} /> Delivery Details</h2>
              <p style={sectionSubStyle}>Provide your shipment destination below.</p>

              <form onSubmit={placeOrder} style={formStyle}>
                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    name="customer_name"
                    placeholder="Recipient's Name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Delivery Address</label>
                  <textarea
                    name="address"
                    placeholder="Street Address, Apartment, Suite, Unit, etc."
                    value={formData.address}
                    onChange={handleChange}
                    style={{ height: "100px", resize: "none" }}
                    required
                  />
                </div>

                {/* Grid for City, State, Pincode */}
                <div style={inputGridStyle}>
                  <div style={fieldGroupStyle}>
                    <label style={labelStyle}>City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={fieldGroupStyle}>
                    <label style={labelStyle}>State</label>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={fieldGroupStyle}>
                    <label style={labelStyle}>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="ZIP Code"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Selection Card */}
            <div className="card" style={{ ...checkoutCardStyle, marginTop: "24px" }}>
              <h2 style={sectionTitleStyle}><FiLock size={18} /> Payment Options</h2>
              <p style={sectionSubStyle}>Select your preferred payment method.</p>

              <div style={paymentSelectorContainerStyle}>
                <label style={paymentOptionStyle(paymentMethod === "cod")}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    style={radioInputStyle}
                  />
                  <div>
                    <strong>Cash on Delivery (COD)</strong>
                    <p style={optionDescStyle}>Pay with cash upon receipt of your bouquet.</p>
                  </div>
                </label>

                <label style={paymentOptionStyle(paymentMethod === "card")}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    style={radioInputStyle}
                  />
                  <div>
                    <strong>Credit / Debit Card</strong>
                    <p style={optionDescStyle}>Pay safely via secure Visa, Mastercard, or RuPay gateway.</p>
                  </div>
                </label>

                <label style={paymentOptionStyle(paymentMethod === "upi")}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    style={radioInputStyle}
                  />
                  <div>
                    <strong>Instant UPI</strong>
                    <p style={optionDescStyle}>Pay instantly using PhonePe, Google Pay, or Paytm.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div style={summaryColumnStyle}>
            <div className="card" style={summaryCardStyle}>
              <h3 style={summaryHeadingStyle}>Order Summary</h3>

              {/* Items Summary list */}
              <div style={itemsSummaryListStyle}>
                {cart.map((item) => (
                  <div key={item.id} style={summaryItemRowStyle}>
                    <div style={itemImageWrapperStyle}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${item.image}`}
                        alt={item.name}
                        style={summaryItemImgStyle}
                      />
                      <span style={itemQtyBadgeStyle}>{item.quantity}</span>
                    </div>

                    <div style={itemMetaStyle}>
                      <span style={itemNameStyle}>{item.name}</span>
                      <span style={itemSubtotalStyle}>₹{Number(item.price) * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div style={breakdownRowStyle}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div style={breakdownRowStyle}>
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span style={{ color: "#10B981", fontWeight: "700" }}>FREE</span>
                ) : (
                  <span>₹{shipping}</span>
                )}
              </div>

              <div style={dividerStyle}></div>

              <div style={totalRowStyle}>
                <span>Total Amount</span>
                <span style={totalPriceStyle}>₹{total}</span>
              </div>

              {/* Place Order submit button */}
              <button
                type="submit"
                onClick={placeOrder}
                disabled={loading || cart.length === 0}
                className="btn-primary"
                style={placeOrderBtnStyle}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <div style={secureDisclaimerStyle}>
                <FiLock size={12} />
                <span>SSL Encrypted & Secure checkout checkout guarantee.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styling definitions
const checkoutHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "32px",
};

const backLinkStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "var(--primary)",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
};

const breadcrumbStyle = {
  fontSize: "12px",
  color: "var(--text-secondary)",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const layoutGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 400px",
  gap: "40px",
  alignItems: "start",
};

const formColumnStyle = {
  display: "flex",
  flexDirection: "column",
};

const checkoutCardStyle = {
  padding: "36px",
};

const sectionTitleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "22px",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "6px",
};

const sectionSubStyle = {
  fontSize: "14px",
  color: "var(--text-secondary)",
  marginBottom: "30px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const fieldGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  alignItems: "flex-start",
};

const labelStyle = {
  fontSize: "13px",
  fontWeight: "700",
  color: "var(--text)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const inputGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "16px",
};

/* Payment selector styles */
const paymentSelectorContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: "20px",
};

const paymentOptionStyle = (active) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: "14px",
  padding: "20px",
  borderRadius: "var(--radius-md)",
  border: active ? "2px solid var(--primary)" : "1.5px solid var(--border)",
  background: active ? "var(--light-purple)" : "#FFF",
  cursor: "pointer",
  transition: "var(--transition)",
  boxShadow: active ? "0 4px 15px rgba(139, 92, 246, 0.05)" : "none",
});

const radioInputStyle = {
  width: "20px",
  height: "20px",
  accentColor: "var(--primary)",
  marginTop: "2px",
  cursor: "pointer",
};

const optionDescStyle = {
  fontSize: "12px",
  color: "var(--text-secondary)",
  marginTop: "4px",
  lineHeight: "1.4",
};

/* Summary sidebar styling */
const summaryColumnStyle = {
  position: "sticky",
  top: "100px",
};

const summaryCardStyle = {
  padding: "30px",
};

const summaryHeadingStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "20px",
  fontWeight: "700",
  marginBottom: "24px",
  borderBottom: "1px solid var(--border)",
  paddingBottom: "12px",
};

const itemsSummaryListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  maxHeight: "260px",
  overflowY: "auto",
  marginBottom: "24px",
  paddingRight: "6px",
};

const summaryItemRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const itemImageWrapperStyle = {
  position: "relative",
  width: "64px",
  height: "64px",
  borderRadius: "8px",
  overflow: "hidden",
  background: "var(--bg-cream)",
  border: "1px solid var(--border)",
  flexShrink: 0,
};

const summaryItemImgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const itemQtyBadgeStyle = {
  position: "absolute",
  top: "-6px",
  right: "-6px",
  background: "var(--text-secondary)",
  color: "#FFF",
  fontSize: "10px",
  fontWeight: "700",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid #FFF",
};

const itemMetaStyle = {
  display: "flex",
  justifyContent: "space-between",
  flex: 1,
  alignItems: "center",
};

const itemNameStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "var(--text)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "180px",
};

const itemSubtotalStyle = {
  fontSize: "14px",
  fontWeight: "700",
  color: "var(--text)",
};

const breakdownRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "14px",
  color: "var(--text-secondary)",
  marginBottom: "12px",
};

const dividerStyle = {
  height: "1px",
  background: "var(--border)",
  margin: "16px 0",
};

const totalRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "700",
  marginBottom: "24px",
};

const totalPriceStyle = {
  fontSize: "24px",
  fontWeight: "800",
  color: "var(--primary)",
};

const placeOrderBtnStyle = {
  width: "100%",
  padding: "16px",
  fontSize: "16px",
};

const secureDisclaimerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  fontSize: "11px",
  color: "var(--text-secondary)",
  marginTop: "20px",
  textAlign: "center",
};

export default Checkout;