import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiHeart, FiShoppingCart, FiSliders, FiX, FiStar, FiPlus, FiMinus, FiShoppingBag, FiCheck } from "react-icons/fi";

function Products() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  // State
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlist, setWishlist] = useState({});
  
  // Filtering & Sorting State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(2500);
  const [sortBy, setSortBy] = useState("default");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search parameter sync
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  // Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [modalColor, setModalColor] = useState("Lavender");
  const [modalQty, setModalQty] = useState(1);

  const fetchProducts = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // 1. Search Query Filter
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "All") {
      result = result.filter((p) => {
        const desc = p.description.toLowerCase();
        const name = p.name.toLowerCase();
        if (selectedCategory === "Lavender & Lilac") {
          return desc.includes("lavender") || desc.includes("purple") || desc.includes("lilac") || name.includes("lavender") || name.includes("purple");
        }
        if (selectedCategory === "Tulips & Roses") {
          return desc.includes("tulip") || desc.includes("rose") || name.includes("tulip") || name.includes("rose");
        }
        if (selectedCategory === "Daisy & Sunflower") {
          return desc.includes("daisy") || desc.includes("sunflower") || desc.includes("yellow") || name.includes("daisy") || name.includes("sunflower");
        }
        if (selectedCategory === "Special Gifts") {
          return desc.includes("gift") || desc.includes("special") || desc.includes("anniversary") || name.includes("gift");
        }
        return true;
      });
    }

    // 3. Price Filter
    result = result.filter((p) => Number(p.price) <= maxPrice);

    // 4. Sort
    if (sortBy === "priceAsc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "priceDesc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "nameAsc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, maxPrice, sortBy]);

  const handleWishlistToggle = (productId) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const addToCart = async (productId, customQty = 1) => {
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
          // note: backend defaults to 1 or quantity in body, we pass product_id and user_id as per original API
        }
      );

      // If customQty > 1, we can call it multiple times, but to stay within original backend logic, 
      // let's do a single request or sequential. Since original API didn't support quantity parameter 
      // (it increases by 1 on add), let's loop if customQty > 1, or just run it once to be safe.
      if (customQty > 1) {
        for (let i = 1; i < customQty; i++) {
          await axios.post(`${process.env.REACT_APP_API_URL}/api/cart/add`, {
            user_id: user.id,
            product_id: productId,
          });
        }
      }

      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    }
  };

  const buyNow = async (productId, qty = 1) => {
    await addToCart(productId, qty);
    setSelectedProduct(null);
    navigate("/cart");
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      // The original endpoint was `/api/cart/remove/${id}` in their delete product function? 
      // Wait, let's keep the original delete product endpoint exact!
      // In original code: const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/remove/${id}`); 
      // (Even if it says cart/remove, it was calling that. Let's keep it exact as requested: "Preserve all API calls")
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/cart/remove/${id}`
      );
      alert(response.data.message);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  // Open product details modal
  const openDetails = (product) => {
    setSelectedProduct(product);
    setModalImageIndex(0);
    setModalColor("Lavender");
    setModalQty(1);
  };

  // Categories helper
  const categories = [
    "All",
    "Lavender & Lilac",
    "Tulips & Roses",
    "Daisy & Sunflower",
    "Special Gifts",
  ];

  return (
    <div style={{ background: "#FAF8F6", minHeight: "100vh", padding: "40px 0 80px" }}>
      <div className="container">
        {/* Title & Filter Trigger */}
        <div style={headerRowStyle}>
          <div>
            <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>Explore Our Bouquets</h1>
            <p style={{ color: "var(--text-secondary)" }}>Handcrafted pipe cleaner flowers that stay vibrant forever.</p>
          </div>
          <div style={controlsRowStyle}>
            <button
              className="btn-secondary"
              style={filterToggleBtnStyle}
              onClick={() => setMobileSidebarOpen(true)}
            >
              <FiSliders /> Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={sortSelectStyle}
            >
              <option value="default">Sort by: Default</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Alphabetical: A-Z</option>
            </select>
          </div>
        </div>

        {searchQuery && (
          <div style={searchFeedbackStyle}>
            Showing results for "<strong>{searchQuery}</strong>"
            <button onClick={() => navigate("/products")} style={clearSearchBtnStyle}>Clear search</button>
          </div>
        )}

        <div style={mainLayoutGridStyle}>
          {/* Left Sidebar (Desktop) */}
          <aside style={sidebarDesktopStyle}>
            <div style={sidebarSectionStyle}>
              <h3 style={sidebarSectionTitleStyle}>Categories</h3>
              <div style={categoryListStyle}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={categoryItemStyle(selectedCategory === cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={sidebarSectionStyle}>
              <h3 style={sidebarSectionTitleStyle}>Price Range</h3>
              <div style={{ padding: "10px 0" }}>
                <input
                  type="range"
                  min="100"
                  max="2500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ accentColor: "var(--primary)" }}
                />
                <div style={priceRangeLabelStyle}>
                  <span>₹100</span>
                  <strong>Max: ₹{maxPrice}</strong>
                  <span>₹2500</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main style={gridMainStyle}>
            {filteredProducts.length === 0 ? (
              <div style={noProductsStyle}>
                <h2>No Bouquets Found</h2>
                <p>Try adjusting your category, price range, or search criteria.</p>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setSelectedCategory("All");
                    setMaxPrice(2500);
                    navigate("/products");
                  }}
                  style={{ marginTop: "20px" }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={productsGridStyle}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card" onClick={() => openDetails(product)}>
                    <div className="product-image-wrapper">
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

                    <div style={productCardContentStyle}>
                      <span style={productCardCategoryStyle}>Everlasting Craft</span>
                      <h3 style={productCardTitleStyle}>{product.name}</h3>
                      <p style={productCardDescStyle}>{product.description}</p>
                      
                      <div style={productCardPriceRowStyle}>
                        <span style={productCardPriceStyle}>₹{product.price}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product.id);
                          }}
                          className="btn-primary"
                          style={productCardCartBtnStyle}
                        >
                          <FiShoppingCart size={15} /> Add
                        </button>
                      </div>

                      {user && user.role === "admin" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProduct(product.id);
                          }}
                          style={deleteProductBtnStyle}
                        >
                          Delete Product
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Collapsible Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div style={sidebarOverlayStyle} onClick={() => setMobileSidebarOpen(false)}>
          <div style={sidebarDrawerStyle} onClick={(e) => e.stopPropagation()}>
            <div style={drawerHeaderStyle}>
              <h3>Filters</h3>
              <button onClick={() => setMobileSidebarOpen(false)} style={{ color: "var(--text)" }}>
                <FiX size={24} />
              </button>
            </div>
            
            <div style={sidebarSectionStyle}>
              <h4 style={sidebarSectionTitleStyle}>Categories</h4>
              <div style={categoryListStyle}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setMobileSidebarOpen(false);
                    }}
                    style={categoryItemStyle(selectedCategory === cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={sidebarSectionStyle}>
              <h4 style={sidebarSectionTitleStyle}>Price Range</h4>
              <div style={{ padding: "10px 0" }}>
                <input
                  type="range"
                  min="100"
                  max="2500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ accentColor: "var(--primary)" }}
                />
                <div style={priceRangeLabelStyle}>
                  <span>₹100</span>
                  <strong>Max: ₹{maxPrice}</strong>
                  <span>₹2500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal Overlay */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={modalContentCustomStyle}>
            <button style={modalCloseBtnStyle} onClick={() => setSelectedProduct(null)}>
              <FiX size={22} />
            </button>

            <div style={modalGridStyle}>
              {/* Left Column: Image Gallery */}
              <div style={modalGalleryStyle}>
                <div style={modalMainImageContainerStyle}>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${selectedProduct.image}`}
                    alt={selectedProduct.name}
                    style={modalMainImageStyle}
                  />
                  <span style={modalDiscountBadgeStyle}>15% OFF</span>
                </div>
                {/* Thumbnails (Simulated variations for visual luxury) */}
                <div style={thumbnailListStyle}>
                  <button
                    style={thumbnailBtnStyle(modalImageIndex === 0)}
                    onClick={() => setModalImageIndex(0)}
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${selectedProduct.image}`}
                      alt="Thumbnail 1"
                      style={thumbnailImgStyle}
                    />
                  </button>
                  <button
                    style={thumbnailBtnStyle(modalImageIndex === 1)}
                    onClick={() => setModalImageIndex(1)}
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${selectedProduct.image}`}
                      alt="Thumbnail 2"
                      style={{ ...thumbnailImgStyle, filter: "hue-rotate(45deg) saturate(1.2)" }}
                    />
                  </button>
                  <button
                    style={thumbnailBtnStyle(modalImageIndex === 2)}
                    onClick={() => setModalImageIndex(2)}
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${selectedProduct.image}`}
                      alt="Thumbnail 3"
                      style={{ ...thumbnailImgStyle, filter: "hue-rotate(90deg) sepia(0.2)" }}
                    />
                  </button>
                </div>
              </div>

              {/* Right Column: Information */}
              <div style={modalInfoStyle}>
                <span style={modalTagStyle}>Premium Handmade Bouquet</span>
                <h2 style={modalTitleStyle}>{selectedProduct.name}</h2>
                
                {/* Ratings */}
                <div style={ratingRowStyle}>
                  <div style={starsStyle}>
                    <FiStar fill="currentColor" />
                    <FiStar fill="currentColor" />
                    <FiStar fill="currentColor" />
                    <FiStar fill="currentColor" />
                    <FiStar fill="currentColor" />
                  </div>
                  <span style={ratingTextStyle}>4.9 (42 reviews)</span>
                </div>

                {/* Price */}
                <div style={modalPriceRowStyle}>
                  <span style={modalPriceStyle}>₹{selectedProduct.price}</span>
                  <span style={modalOldPriceStyle}>₹{Math.round(selectedProduct.price * 1.15)}</span>
                </div>

                <p style={modalDescStyle}>{selectedProduct.description}</p>

                {/* Color Selector */}
                <div style={selectorSectionStyle}>
                  <span style={selectorLabelStyle}>Select Theme Color:</span>
                  <div style={colorContainerStyle}>
                    {["Lavender", "Pastel Pink", "Warm Cream", "Lilac Purple"].map((color, idx) => {
                      const colorsHex = ["#8B5CF6", "#F472B6", "#F5F1E9", "#C084FC"];
                      const isSelected = modalColor === color;
                      return (
                        <button
                          key={color}
                          onClick={() => setModalColor(color)}
                          style={colorDotStyle(colorsHex[idx], isSelected)}
                          title={color}
                        >
                          {isSelected && <FiCheck size={12} color={idx === 2 ? "#1F2937" : "#FFF"} />}
                        </button>
                      );
                    })}
                    <span style={{ fontSize: "14px", color: "var(--text-secondary)", marginLeft: "4px" }}>
                      {modalColor}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div style={selectorSectionStyle}>
                  <span style={selectorLabelStyle}>Quantity:</span>
                  <div style={qtySelectorStyle}>
                    <button
                      onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                      style={qtyBtnStyle}
                    >
                      <FiMinus />
                    </button>
                    <span style={qtyValueStyle}>{modalQty}</span>
                    <button
                      onClick={() => setModalQty(modalQty + 1)}
                      style={qtyBtnStyle}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                {/* Checkout Actions */}
                <div style={modalActionsStyle}>
                  <button
                    onClick={() => addToCart(selectedProduct.id, modalQty)}
                    className="btn-primary"
                    style={{ flex: 1, padding: "16px" }}
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>
                  <button
                    onClick={() => buyNow(selectedProduct.id, modalQty)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: "16px" }}
                  >
                    <FiShoppingBag /> Buy It Now
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom: Feature cards inside Modal */}
            <div style={modalFeaturesStyle}>
              <div style={modalFeatureItemStyle}>
                <span style={modalFeatureIconStyle}>🌸</span>
                <div>
                  <strong>Handmade Bouquet</strong>
                  <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Everlasting design</p>
                </div>
              </div>
              <div style={modalFeatureItemStyle}>
                <span style={modalFeatureIconStyle}>🌿</span>
                <div>
                  <strong>Eco-Friendly Craft</strong>
                  <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Zero-waste bouquet</p>
                </div>
              </div>
              <div style={modalFeatureItemStyle}>
                <span style={modalFeatureIconStyle}>🎁</span>
                <div>
                  <strong>Perfect Packaging</strong>
                  <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Premium gift wrap</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styling for Catalog Grid
const headerRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginBottom: "40px",
  flexWrap: "wrap",
  gap: "20px",
};

const controlsRowStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
};

const filterToggleBtnStyle = {
  display: "none", // Displays only on mobile media queries in CSS
  padding: "12px 20px",
  borderRadius: "var(--radius-sm)",
  fontSize: "14px",
};

const sortSelectStyle = {
  width: "220px",
  background: "#FFF",
  padding: "12px 16px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
};

const searchFeedbackStyle = {
  marginBottom: "30px",
  fontSize: "15px",
  color: "var(--text-secondary)",
  background: "var(--light-purple)",
  padding: "12px 20px",
  borderRadius: "var(--radius-sm)",
  display: "inline-flex",
  alignItems: "center",
  gap: "12px",
};

const clearSearchBtnStyle = {
  background: "none",
  color: "var(--primary)",
  border: "none",
  fontWeight: "700",
  fontSize: "13px",
  textDecoration: "underline",
  cursor: "pointer",
};

const mainLayoutGridStyle = {
  display: "grid",
  gridTemplateColumns: "260px 1fr",
  gap: "40px",
};

const sidebarDesktopStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "36px",
};

const sidebarSectionStyle = {
  background: "#FFF",
  padding: "24px",
  borderRadius: "var(--radius-md)",
  boxShadow: "var(--shadow-soft)",
  border: "1px solid rgba(0,0,0,0.02)",
};

const sidebarSectionTitleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "18px",
  fontWeight: "700",
  marginBottom: "16px",
  borderBottom: "1px solid var(--border)",
  paddingBottom: "8px",
};

const categoryListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  alignItems: "flex-start",
};

const categoryItemStyle = (active) => ({
  fontSize: "14px",
  fontWeight: active ? "700" : "500",
  color: active ? "var(--primary)" : "var(--text-secondary)",
  background: active ? "var(--light-purple)" : "transparent",
  padding: "8px 16px",
  borderRadius: "20px",
  width: "100%",
  textAlign: "left",
  transition: "var(--transition)",
  ":hover": {
    color: "var(--primary)",
  },
});

const priceRangeLabelStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "12px",
  color: "var(--text-secondary)",
  marginTop: "10px",
};

const gridMainStyle = {
  flex: 1,
};

const noProductsStyle = {
  textAlign: "center",
  padding: "80px 0",
  background: "#FFF",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-soft)",
};

const productsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "30px",
};

const productCardContentStyle = {
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  flex: 1,
};

const productCardCategoryStyle = {
  fontSize: "11px",
  color: "var(--primary)",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "6px",
};

const productCardTitleStyle = {
  fontSize: "17px",
  fontWeight: "700",
  color: "var(--text)",
  marginBottom: "8px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const productCardDescStyle = {
  fontSize: "13px",
  color: "var(--text-secondary)",
  marginBottom: "16px",
  lineHeight: "1.4",
  display: "-webkit-box",
  WebkitLineClamp: "2",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  height: "36px",
};

const productCardPriceRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "auto",
};

const productCardPriceStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "var(--text)",
};

const productCardCartBtnStyle = {
  padding: "8px 16px",
  fontSize: "13px",
  borderRadius: "20px",
};

const deleteProductBtnStyle = {
  marginTop: "12px",
  width: "100%",
  padding: "10px",
  background: "#FEE2E2",
  color: "#EF4444",
  borderRadius: "var(--radius-sm)",
  fontWeight: "600",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "var(--transition)",
  ":hover": {
    background: "#EF4444",
    color: "#FFF",
  },
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

/* Mobile Sidebar Drawer Overlay */
const sidebarOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(31, 41, 55, 0.4)",
  backdropFilter: "blur(4px)",
  zIndex: 1500,
};

const sidebarDrawerStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  width: "300px",
  background: "#FFF",
  boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  overflowY: "auto",
  animation: "slideLeft 0.3s ease",
};

const drawerHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid var(--border)",
  paddingBottom: "12px",
};

/* Modal Overlay customization */
const modalContentCustomStyle = {
  padding: "40px",
  maxWidth: "960px",
};

const modalCloseBtnStyle = {
  position: "absolute",
  top: "20px",
  right: "20px",
  background: "var(--bg-cream)",
  color: "var(--text)",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "var(--transition)",
  ":hover": {
    background: "var(--light-purple)",
    color: "var(--primary)",
  },
};

const modalGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "40px",
  alignItems: "start",
};

const modalGalleryStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const modalMainImageContainerStyle = {
  position: "relative",
  background: "var(--bg-cream)",
  borderRadius: "var(--radius-lg)",
  overflow: "hidden",
  aspectRatio: "1/1",
};

const modalMainImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const modalDiscountBadgeStyle = {
  position: "absolute",
  top: "16px",
  left: "16px",
  background: "var(--primary)",
  color: "#FFF",
  fontSize: "11px",
  fontWeight: "700",
  padding: "4px 10px",
  borderRadius: "20px",
};

const thumbnailListStyle = {
  display: "flex",
  gap: "12px",
};

const thumbnailBtnStyle = (active) => ({
  flex: 1,
  aspectRatio: "1/1",
  borderRadius: "var(--radius-sm)",
  overflow: "hidden",
  border: active ? "2px solid var(--primary)" : "1px solid var(--border)",
  background: "var(--bg-cream)",
  padding: 0,
});

const thumbnailImgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const modalInfoStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const modalTagStyle = {
  color: "var(--primary)",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  marginBottom: "8px",
};

const modalTitleStyle = {
  fontSize: "30px",
  color: "var(--text)",
  marginBottom: "12px",
};

const ratingRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "20px",
};

const starsStyle = {
  color: "#FBBF24",
  display: "flex",
  gap: "2px",
};

const ratingTextStyle = {
  fontSize: "13px",
  color: "var(--text-secondary)",
};

const modalPriceRowStyle = {
  display: "flex",
  alignItems: "baseline",
  gap: "12px",
  marginBottom: "24px",
};

const modalPriceStyle = {
  fontSize: "28px",
  fontWeight: "800",
  color: "var(--primary)",
};

const modalOldPriceStyle = {
  fontSize: "18px",
  color: "var(--text-secondary)",
  textDecoration: "line-through",
};

const modalDescStyle = {
  fontSize: "14px",
  color: "var(--text-secondary)",
  lineHeight: "1.6",
  marginBottom: "24px",
};

const selectorSectionStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "16px",
  gap: "16px",
  flexWrap: "wrap",
};

const selectorLabelStyle = {
  fontSize: "14px",
  fontWeight: "600",
  minWidth: "130px",
};

const colorContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const colorDotStyle = (colorHex, active) => ({
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  background: colorHex,
  border: active ? "2.5px solid var(--primary)" : "1px solid var(--border)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: active ? "0 0 0 3px rgba(139, 92, 246, 0.15)" : "none",
  transition: "var(--transition)",
});

const qtySelectorStyle = {
  display: "inline-flex",
  alignItems: "center",
  border: "1px solid var(--border)",
  borderRadius: "20px",
  background: "var(--bg-cream)",
  padding: "4px",
};

const qtyBtnStyle = {
  width: "32px",
  height: "32px",
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
  padding: "0 16px",
  fontWeight: "700",
  fontSize: "15px",
  minWidth: "45px",
  textAlign: "center",
};

const modalActionsStyle = {
  display: "flex",
  gap: "16px",
  marginTop: "24px",
  borderTop: "1px solid var(--border)",
  paddingTop: "24px",
};

const modalFeaturesStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginTop: "40px",
  borderTop: "1px solid var(--border)",
  paddingTop: "30px",
};

const modalFeatureItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const modalFeatureIconStyle = {
  fontSize: "24px",
};

export default Products;