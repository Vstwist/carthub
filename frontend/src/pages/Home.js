import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiHeart, FiShoppingCart, FiArrowRight, FiCheckCircle, FiGift, FiAward, FiShield, FiSmile } from "react-icons/fi";

function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [wishlist, setWishlist] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  // SEO metadata & Fetch Featured Products
  useEffect(() => {
    document.title = "V's Twist | Premium Handmade Pipe Cleaner Flower Bouquets";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Shop premium handmade pipe cleaner flower bouquets at V's Twist. Elegant, everlasting luxury gifts crafted with care."
      );
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/products`)
      .then((res) => {
        // Take the first 4 products as featured products
        setFeaturedProducts(res.data.slice(0, 4));
      })
      .catch((err) => {
        console.error("Error fetching featured products:", err);
      });
  }, []);

  const handleWishlistToggle = (productId) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const addToCart = async (productId) => {
    try {
      if (!user) {
        alert("Please login first");
        navigate("/login");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart/add`,
        {
          user_id: user.id,
          product_id: productId,
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    }
  };

  return (
    <div style={{ background: "#FAF8F6", minHeight: "100vh" }}>
      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <div className="container" style={heroContainerStyle}>
          {/* Left Text content */}
          <div style={heroLeftStyle}>
            <span style={heroTaglineStyle}>Handmade with Love & Care</span>
            <h1 style={heroHeadingStyle}>
              Handmade <br />
              Flowers
            </h1>
            <p style={heroSubtextStyle}>
              Premium handmade pipe cleaner flower bouquets designed to bring everlasting joy and color to your home or special occasions.
            </p>
            <Link to="/products">
              <button className="btn-primary" style={{ padding: "16px 36px", fontSize: "16px" }}>
                Shop Now <FiArrowRight />
              </button>
            </Link>
          </div>

          {/* Right Image */}
          <div style={heroRightStyle}>
            <div style={imageContainerStyle}>
              <img
                src={process.env.PUBLIC_URL + "/image/hero.png"}
                alt="Beautiful Pipe Cleaner Bouquet"
                style={heroImageStyle}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80"; // Premium Unsplash flower backup if hero.png fails
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid Section */}
      <section style={featuresSectionStyle}>
        <div className="container">
          <div style={featuresGridStyle}>
            <div className="card" style={featureCardStyle}>
              <div style={iconWrapperStyle}><FiAward size={24} /></div>
              <h3 style={featureTitleStyle}>Handmade with Care</h3>
              <p style={featureDescStyle}>Each bouquet is meticulously crafted by skilled hands.</p>
            </div>
            <div className="card" style={featureCardStyle}>
              <div style={iconWrapperStyle}><FiSmile size={24} /></div>
              <h3 style={featureTitleStyle}>Premium Quality</h3>
              <p style={featureDescStyle}>Finest quality soft pipe cleaners designed to look stunning.</p>
            </div>
            <div className="card" style={featureCardStyle}>
              <div style={iconWrapperStyle}><FiCheckCircle size={24} /></div>
              <h3 style={featureTitleStyle}>Eco Friendly</h3>
              <p style={featureDescStyle}>Long lasting everlasting flowers that never waste water.</p>
            </div>
            <div className="card" style={featureCardStyle}>
              <div style={iconWrapperStyle}><FiGift size={24} /></div>
              <h3 style={featureTitleStyle}>Perfect for Gifting</h3>
              <p style={featureDescStyle}>Wrapped beautifully, making it the perfect unique present.</p>
            </div>
            <div className="card" style={featureCardStyle}>
              <div style={iconWrapperStyle}><FiShield size={24} /></div>
              <h3 style={featureTitleStyle}>Safe Payment</h3>
              <p style={featureDescStyle}>Fully secure transactions and guaranteed checkout safety.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      {featuredProducts.length > 0 && (
        <section style={featuredSectionStyle}>
          <div className="container">
            <h2 className="section-title">Our Featured Bouquets</h2>
            <p className="section-subtitle">Discover our most loved hand-crafted creations</p>

            <div style={productGridStyle}>
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card" style={productCardOverrideStyle}>
                  <div className="product-image-wrapper" onClick={() => navigate("/products")}>
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${product.image}`}
                      alt={product.name}
                    />
                    <button
                      style={wishlistBtnStyle(wishlist[product.id])}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(product.id);
                      }}
                      aria-label="Add to Wishlist"
                    >
                      <FiHeart size={18} fill={wishlist[product.id] ? "var(--primary)" : "none"} />
                    </button>
                  </div>

                  <div style={productContentStyle}>
                    <span style={productCategoryStyle}>Handmade Bouquet</span>
                    <h3 style={productTitleStyle} onClick={() => navigate("/products")}>{product.name}</h3>
                    <p style={productDescriptionStyle}>{product.description}</p>
                    <div style={productPriceRowStyle}>
                      <span style={productPriceStyle}>₹{product.price}</span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="btn-primary"
                        style={addToCartIconBtnStyle}
                        title="Add to Cart"
                      >
                        <FiShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link to="/products">
                <button className="btn-secondary">
                  View All Products <FiArrowRight />
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Custom styles for Home Page layout
const heroSectionStyle = {
  padding: "60px 0 40px",
};

const heroContainerStyle = {
  background: "linear-gradient(135deg, #FDFCFB 0%, #F5F1FF 100%)",
  borderRadius: "var(--radius-lg)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "60px 8%",
  gap: "40px",
  boxShadow: "var(--shadow-soft)",
  flexWrap: "wrap",
};

const heroLeftStyle = {
  flex: "1 1 500px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const heroTaglineStyle = {
  color: "var(--primary)",
  fontSize: "14px",
  fontWeight: "700",
  letterSpacing: "2px",
  textTransform: "uppercase",
  marginBottom: "12px",
};

const heroHeadingStyle = {
  fontSize: "clamp(36px, 5vw, 56px)",
  color: "var(--text)",
  lineHeight: "1.15",
  marginBottom: "24px",
};

const heroSubtextStyle = {
  fontSize: "17px",
  color: "var(--text-secondary)",
  lineHeight: "1.7",
  marginBottom: "36px",
  maxWidth: "520px",
};

const heroRightStyle = {
  flex: "1 1 400px",
  display: "flex",
  justifyContent: "center",
};

const imageContainerStyle = {
  width: "100%",
  maxWidth: "480px",
  borderRadius: "var(--radius-lg)",
  overflow: "hidden",
  boxShadow: "0 15px 40px rgba(139, 92, 246, 0.12)",
  background: "#FFF",
};

const heroImageStyle = {
  width: "100%",
  height: "auto",
  maxHeight: "450px",
  display: "block",
  transition: "var(--transition)",
  ":hover": {
    transform: "scale(1.03)",
  },
};

/* Features Grid */
const featuresSectionStyle = {
  padding: "40px 0",
};

const featuresGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "20px",
};

const featureCardStyle = {
  padding: "24px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  background: "#FFF",
  borderRadius: "var(--radius-md)",
};

const iconWrapperStyle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "var(--light-purple)",
  color: "var(--primary)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const featureTitleStyle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "var(--text)",
};

const featureDescStyle = {
  fontSize: "13px",
  color: "var(--text-secondary)",
  lineHeight: "1.5",
};

/* Featured Products */
const featuredSectionStyle = {
  padding: "60px 0 80px",
};

const productGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "30px",
  marginTop: "20px",
};

const productCardOverrideStyle = {
  cursor: "pointer",
};

const wishlistBtnStyle = (active) => ({
  position: "absolute",
  top: "14px",
  right: "14px",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "#FFF",
  boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  color: active ? "var(--primary)" : "var(--text-secondary)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  transition: "var(--transition)",
  ":hover": {
    transform: "scale(1.1)",
  },
});

const productContentStyle = {
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  flex: 1,
};

const productCategoryStyle = {
  fontSize: "12px",
  color: "var(--primary)",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "6px",
};

const productTitleStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "var(--text)",
  marginBottom: "8px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const productDescriptionStyle = {
  fontSize: "14px",
  color: "var(--text-secondary)",
  marginBottom: "16px",
  lineHeight: "1.4",
  display: "-webkit-box",
  WebkitLineClamp: "2",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  height: "38px",
};

const productPriceRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "auto",
};

const productPriceStyle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "var(--text)",
};

const addToCartIconBtnStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default Home;