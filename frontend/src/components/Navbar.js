import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiUser, FiHeart, FiShoppingCart, FiMenu, FiX, FiLogOut, FiPlusCircle } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Sync Cart Count
  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }
    const fetchCartCount = () => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/cart/${user.id}`)
        .then((response) => {
          const count = response.data.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(count);
        })
        .catch((error) => {
          console.error("Error fetching cart count:", error);
        });
    };

    fetchCartCount();
    const interval = setInterval(fetchCartCount, 3000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={headerStyle}>
      <div className="container" style={navContainerStyle}>
        {/* Hamburger Menu Icon (Tablet & Mobile) */}
        <button
          style={hamburgerBtnStyle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" style={logoStyle}>
          <span role="img" aria-label="flower">🌸</span> V's Twist
        </Link>

        {/* Centered Navigation Links */}
        <nav style={desktopNavStyle}>
          <Link to="/" style={navLinkStyle(isActive("/"))}>
            Home
          </Link>
          <Link to="/products" style={navLinkStyle(isActive("/products"))}>
            Products
          </Link>
          <Link to="/cart" style={navLinkStyle(isActive("/cart"))}>
            Cart
          </Link>
          {user?.role === "admin" && (
            <Link to="/add-product" style={navLinkStyle(isActive("/add-product"))}>
              Add Product
            </Link>
          )}
        </nav>

        {/* Right Actions Menu */}
        <div style={actionsContainerStyle}>
          {/* Search Toggle */}
          <div style={{ position: "relative" }}>
            <button
              style={iconBtnStyle}
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>
            {searchOpen && (
              <form onSubmit={handleSearchSubmit} style={searchFormStyle}>
                <input
                  type="text"
                  placeholder="Search bouquets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={searchInputStyle}
                  autoFocus
                />
              </form>
            )}
          </div>

          {/* User Profile / Status */}
          {user ? (
            <div style={userWrapperStyle}>
              <div style={userBadgeStyle}>
                <FiUser size={16} />
                <span style={userNameStyle}>{user.name.split(" ")[0]}</span>
              </div>
              <button onClick={handleLogout} style={logoutBtnStyle} title="Logout">
                <FiLogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" style={iconBtnStyle} title="Login">
              <FiUser size={20} />
            </Link>
          )}

          {/* Wishlist Button (Mock logic) */}
          <button style={iconBtnStyle} onClick={() => navigate("/products")} title="Wishlist">
            <FiHeart size={20} />
          </button>

          {/* Cart Icon with badge */}
          <Link to="/cart" style={cartIconWrapperStyle}>
            <FiShoppingCart size={20} />
            {cartCount > 0 && <span style={cartBadgeStyle}>{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={mobileDrawerOverlayStyle} onClick={() => setMobileMenuOpen(false)}>
          <div style={mobileDrawerContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={mobileDrawerHeaderStyle}>
              <Link to="/" style={logoStyle} onClick={() => setMobileMenuOpen(false)}>
                🌸 V's Twist
              </Link>
              <button style={iconBtnStyle} onClick={() => setMobileMenuOpen(false)}>
                <FiX size={24} />
              </button>
            </div>
            <nav style={mobileNavStyle}>
              <Link to="/" style={mobileNavLinkStyle(isActive("/"))} onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" style={mobileNavLinkStyle(isActive("/products"))} onClick={() => setMobileMenuOpen(false)}>
                Products
              </Link>
              <Link to="/cart" style={mobileNavLinkStyle(isActive("/cart"))} onClick={() => setMobileMenuOpen(false)}>
                Cart
              </Link>
              {user?.role === "admin" && (
                <Link to="/add-product" style={mobileNavLinkStyle(isActive("/add-product"))} onClick={() => setMobileMenuOpen(false)}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <FiPlusCircle /> Add Product
                  </span>
                </Link>
              )}
              {user ? (
                <div style={mobileUserSectionStyle}>
                  <p style={mobileUserWelcomeStyle}>Logged in as <strong>{user.name}</strong></p>
                  <button onClick={handleLogout} style={mobileLogoutBtnStyle}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" style={mobileLoginBtnStyle} onClick={() => setMobileMenuOpen(false)}>
                  <FiUser /> Login / Register
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

// Inline Styles for luxury & responsiveness
const headerStyle = {
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.03)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  borderBottom: "1px solid rgba(229, 231, 235, 0.5)",
  transition: "var(--transition)",
};

const navContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 0",
  position: "relative",
};

const logoStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "26px",
  fontWeight: "800",
  color: "var(--primary)",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const desktopNavStyle = {
  display: "flex",
  alignItems: "center",
  gap: "32px",
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  // Hide on screens below 768px via media query style sheets
};

// Apply hover styles dynamically in CSS or simple elements
const navLinkStyle = (active) => ({
  fontSize: "15px",
  fontWeight: "600",
  color: active ? "var(--primary)" : "var(--text-secondary)",
  position: "relative",
  padding: "8px 0",
});

const actionsContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
};

const iconBtnStyle = {
  color: "var(--text)",
  padding: "8px",
  borderRadius: "50%",
  transition: "var(--transition)",
  ":hover": {
    background: "var(--light-purple)",
    color: "var(--primary)",
  },
};

const cartIconWrapperStyle = {
  position: "relative",
  color: "var(--text)",
  padding: "8px",
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "var(--transition)",
};

const cartBadgeStyle = {
  position: "absolute",
  top: "-2px",
  right: "-2px",
  background: "var(--primary)",
  color: "#FFF",
  fontSize: "10px",
  fontWeight: "700",
  minWidth: "18px",
  height: "18px",
  borderRadius: "9px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 4px",
  border: "2px solid #FFF",
};

const hamburgerBtnStyle = {
  display: "none", // Will be shown on mobile media query in app.css or inline-media style
  color: "var(--text)",
  padding: "8px",
};

const searchFormStyle = {
  position: "absolute",
  top: "100%",
  right: 0,
  marginTop: "8px",
  background: "#FFF",
  padding: "8px",
  borderRadius: "var(--radius-sm)",
  boxShadow: "var(--shadow-soft)",
  border: "1px solid var(--border)",
  width: "280px",
  zIndex: 1001,
  animation: "fadeIn 0.2s ease",
};

const searchInputStyle = {
  padding: "10px 14px",
  fontSize: "14px",
};

const userWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "var(--light-purple)",
  padding: "4px 12px",
  borderRadius: "20px",
};

const userBadgeStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: "var(--primary)",
  fontWeight: "600",
  fontSize: "13px",
};

const userNameStyle = {
  maxWidth: "80px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const logoutBtnStyle = {
  color: "var(--text-secondary)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4px",
  borderRadius: "50%",
  ":hover": {
    color: "#EF4444",
  },
};

/* Mobile Drawer Styles */
const mobileDrawerOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(31, 41, 55, 0.4)",
  backdropFilter: "blur(4px)",
  zIndex: 2000,
};

const mobileDrawerContentStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,
  width: "300px",
  background: "#FFF",
  boxShadow: "10px 0 30px rgba(0,0,0,0.1)",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  animation: "slideRight 0.3s ease",
};

const mobileDrawerHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const mobileNavStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const mobileNavLinkStyle = (active) => ({
  fontSize: "16px",
  fontWeight: "600",
  color: active ? "var(--primary)" : "var(--text)",
  padding: "12px 16px",
  borderRadius: "var(--radius-sm)",
  background: active ? "var(--light-purple)" : "transparent",
});

const mobileUserSectionStyle = {
  marginTop: "24px",
  paddingTop: "24px",
  borderTop: "1px solid var(--border)",
};

const mobileUserWelcomeStyle = {
  fontSize: "14px",
  color: "var(--text-secondary)",
  marginBottom: "12px",
};

const mobileLogoutBtnStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "var(--radius-sm)",
  background: "#FEE2E2",
  color: "#EF4444",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

const mobileLoginBtnStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "var(--radius-sm)",
  background: "var(--light-purple)",
  color: "var(--primary)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  marginTop: "24px",
  fontWeight: "600",
};

export default Navbar;
