import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight, FiShield, FiTruck, FiRefreshCw } from "react-icons/fi";

function Cart() {
  const [cart, setCart] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchCart = () => {
    if (!user) return;
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/cart/${user.id}`)
      .then((response) => {
        setCart(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
      });
  };

  useEffect(() => {
    document.title = "Shopping Cart | V's Twist";
    if (!user) {
      alert("Please login to view your cart");
      navigate("/login");
      return;
    }
    fetchCart();
  }, []);

  const increaseQuantity = (id) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/api/cart/increase/${id}`)
      .then(() => {
        fetchCart();
      })
      .catch((err) => console.error("Error increasing qty:", err));
  };

  const decreaseQuantity = (id) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/api/cart/decrease/${id}`)
      .then(() => {
        fetchCart();
      })
      .catch((err) => console.error("Error decreasing qty:", err));
  };

  const removeItem = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/cart/remove/${id}`)
      .then(() => {
        fetchCart();
      })
      .catch((err) => console.error("Error removing item:", err));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // Luxury shipping estimation
  const shipping = subtotal > 1000 ? 0 : subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div style={{ background: "#FAF8F6", minHeight: "100vh", padding: "60px 0 80px" }}>
      <div className="container">
        {/* Title */}
        <div style={titleContainerStyle}>
          <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>Your Shopping Cart</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Review your handcrafted selections before checking out.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="card" style={emptyCartStyle}>
            <div style={emptyIconWrapperStyle}>
              <FiShoppingBag size={42} />
            </div>
            <h2 style={{ fontSize: "24px", margin: "16px 0 8px" }}>Your cart is empty</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "30px", maxWidth: "400px" }}>
              Looks like you haven't added any of our beautiful bouquets to your cart yet.
            </p>
            <Link to="/products">
              <button className="btn-primary">
                Browse Bouquets <FiArrowRight />
              </button>
            </Link>
          </div>
        ) : (
          <div style={cartLayoutGridStyle}>
            {/* Left side: Items List */}
            <div style={itemsListWrapperStyle}>
              <div style={itemsHeaderRowStyle}>
                <span style={{ flex: 2 }}>Product</span>
                <span style={{ flex: 1, textAlign: "center" }}>Price</span>
                <span style={{ flex: 1, textAlign: "center" }}>Quantity</span>
                <span style={{ flex: 1, textAlign: "right" }}>Total</span>
              </div>

              <div style={itemsContainerStyle}>
                {cart.map((item) => (
                  <div key={item.id} className="card" style={itemCardStyle}>
                    {/* Item Image */}
                    <div style={itemImageContainerStyle}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${item.image}`}
                        alt={item.name}
                        style={itemImageStyle}
                      />
                    </div>

                    {/* Item Info / Mobile layouts */}
                    <div style={itemDetailsStyle}>
                      <div style={{ flex: 2 }}>
                        <h3 style={itemNameStyle}>{item.name}</h3>
                        <p style={itemDescStyle}>{item.description}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={removeItemBtnStyle}
                          aria-label="Remove Item"
                        >
                          <FiTrash2 size={14} /> Remove
                        </button>
                      </div>

                      {/* Price column */}
                      <div style={itemPriceStyle}>
                        <span>₹{item.price}</span>
                      </div>

                      {/* Quantity column */}
                      <div style={itemQtyColumnStyle}>
                        <div style={qtySelectorStyle}>
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            style={qtyBtnStyle}
                            aria-label="Decrease Quantity"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span style={qtyValueStyle}>{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            style={qtyBtnStyle}
                            aria-label="Increase Quantity"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal column */}
                      <div style={itemSubtotalStyle}>
                        <span>₹{Number(item.price) * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantees below cart */}
              <div style={guaranteesRowStyle}>
                <div style={guaranteeItemStyle}>
                  <FiTruck size={20} color="var(--primary)" />
                  <div>
                    <strong style={{ fontSize: "14px" }}>Fast Delivery</strong>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Carefully packed & boxed</p>
                  </div>
                </div>
                <div style={guaranteeItemStyle}>
                  <FiRefreshCw size={20} color="var(--primary)" />
                  <div>
                    <strong style={{ fontSize: "14px" }}>Everlasting Quality</strong>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Stays vibrant forever</p>
                  </div>
                </div>
                <div style={guaranteeItemStyle}>
                  <FiShield size={20} color="var(--primary)" />
                  <div>
                    <strong style={{ fontSize: "14px" }}>Secure Payments</strong>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Fully encrypted transactions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Cart Summary Card */}
            <div style={summarySidebarStyle}>
              <div className="card" style={summaryCardStyle}>
                <h2 style={summaryTitleStyle}>Order Summary</h2>
                
                <div style={summaryRowStyle(false)}>
                  <span>Subtotal</span>
                  <strong>₹{subtotal}</strong>
                </div>

                <div style={summaryRowStyle(false)}>
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <strong style={{ color: "#10B981" }}>FREE</strong>
                  ) : (
                    <strong>₹{shipping}</strong>
                  )}
                </div>

                {shipping > 0 && (
                  <p style={shippingTipStyle}>
                    Add <strong>₹{1000 - subtotal}</strong> more for <strong>FREE shipping</strong>!
                  </p>
                )}

                <div style={dividerStyle}></div>

                <div style={summaryRowStyle(true)}>
                  <span>Total Amount</span>
                  <span style={summaryTotalAmountStyle}>₹{total}</span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="btn-primary"
                  style={checkoutBtnStyle}
                >
                  Proceed to Checkout <FiArrowRight />
                </button>

                {/* Secure checkout text & trust badges */}
                <div style={trustSectionStyle}>
                  <span style={trustTitleStyle}>100% SECURE CHECKOUT GUARANTEED</span>
                  <div style={badgeRowStyle}>
                    <div style={paymentBadgeStyle}>Visa</div>
                    <div style={paymentBadgeStyle}>Mastercard</div>
                    <div style={paymentBadgeStyle}>UPI</div>
                    <div style={paymentBadgeStyle}>NetBanking</div>
                  </div>
                </div>
              </div>

              <Link to="/products" style={continueShoppingLinkStyle}>
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Styling definitions
const titleContainerStyle = {
  marginBottom: "40px",
};

const emptyCartStyle = {
  padding: "60px 40px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "600px",
  margin: "0 auto",
};

const emptyIconWrapperStyle = {
  width: "80px",
  height: "80px",
  background: "var(--light-purple)",
  color: "var(--primary)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cartLayoutGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 380px",
  gap: "40px",
  alignItems: "start",
};

const itemsListWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const itemsHeaderRowStyle = {
  display: "flex",
  padding: "0 24px",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: "var(--text-secondary)",
  // Hidden on mobile media queries in CSS
};

const itemsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const itemCardStyle = {
  display: "flex",
  padding: "20px",
  gap: "24px",
  alignItems: "center",
};

const itemImageContainerStyle = {
  width: "120px",
  height: "120px",
  borderRadius: "var(--radius-sm)",
  overflow: "hidden",
  background: "var(--bg-cream)",
  flexShrink: 0,
};

const itemImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const itemDetailsStyle = {
  display: "flex",
  flex: 1,
  alignItems: "center",
  gap: "20px",
  // Stack on mobile via CSS
};

const itemNameStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "var(--text)",
  marginBottom: "4px",
};

const itemDescStyle = {
  fontSize: "13px",
  color: "var(--text-secondary)",
  lineHeight: "1.4",
  marginBottom: "12px",
  display: "-webkit-box",
  WebkitLineClamp: "1",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const removeItemBtnStyle = {
  fontSize: "12px",
  color: "var(--text-secondary)",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "4px 8px",
  borderRadius: "12px",
  background: "var(--bg-cream)",
  transition: "var(--transition)",
  ":hover": {
    color: "#EF4444",
    background: "#FEE2E2",
  },
};

const itemPriceStyle = {
  flex: 1,
  textAlign: "center",
  fontWeight: "600",
  color: "var(--text)",
};

const itemQtyColumnStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
};

const qtySelectorStyle = {
  display: "inline-flex",
  alignItems: "center",
  border: "1px solid var(--border)",
  borderRadius: "20px",
  background: "var(--bg-cream)",
  padding: "2px",
};

const qtyBtnStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  background: "#FFF",
  color: "var(--text)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ":hover": {
    background: "var(--light-purple)",
    color: "var(--primary)",
  },
};

const qtyValueStyle = {
  padding: "0 10px",
  fontWeight: "700",
  fontSize: "14px",
  minWidth: "30px",
  textAlign: "center",
};

const itemSubtotalStyle = {
  flex: 1,
  textAlign: "right",
  fontWeight: "700",
  fontSize: "16px",
  color: "var(--primary)",
};

const guaranteesRowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginTop: "20px",
  background: "#FFF",
  padding: "24px",
  borderRadius: "var(--radius-md)",
  boxShadow: "var(--shadow-soft)",
};

const guaranteeItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

/* Summary Sidebar */
const summarySidebarStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const summaryCardStyle = {
  padding: "30px",
};

const summaryTitleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "22px",
  fontWeight: "700",
  marginBottom: "24px",
};

const summaryRowStyle = (isTotal) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: isTotal ? "16px" : "14px",
  fontWeight: isTotal ? "700" : "500",
  color: isTotal ? "var(--text)" : "var(--text-secondary)",
  marginBottom: "16px",
});

const summaryTotalAmountStyle = {
  fontSize: "24px",
  fontWeight: "800",
  color: "var(--primary)",
};

const shippingTipStyle = {
  fontSize: "12px",
  color: "var(--primary)",
  background: "var(--light-purple)",
  padding: "8px 12px",
  borderRadius: "8px",
  marginBottom: "16px",
  textAlign: "left",
};

const dividerStyle = {
  height: "1px",
  background: "var(--border)",
  margin: "12px 0 20px",
};

const checkoutBtnStyle = {
  width: "100%",
  padding: "16px",
  fontSize: "16px",
  marginTop: "10px",
};

const trustSectionStyle = {
  marginTop: "30px",
  textAlign: "center",
  borderTop: "1px solid var(--border)",
  paddingTop: "20px",
};

const trustTitleStyle = {
  display: "block",
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "1px",
  color: "var(--text-secondary)",
  marginBottom: "12px",
};

const badgeRowStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "8px",
  flexWrap: "wrap",
};

const paymentBadgeStyle = {
  fontSize: "10px",
  fontWeight: "700",
  color: "var(--text-secondary)",
  border: "1px solid var(--border)",
  borderRadius: "4px",
  padding: "4px 8px",
  background: "var(--bg-cream)",
};

const continueShoppingLinkStyle = {
  textAlign: "center",
  fontSize: "14px",
  fontWeight: "600",
  color: "var(--primary)",
  textDecoration: "underline",
  cursor: "pointer",
};

export default Cart;