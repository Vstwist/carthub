import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiPlusCircle, FiTag, FiFileText, FiDollarSign, FiImage } from "react-icons/fi";

function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    document.title = "Add Product | Admin | V's Twist";
    // Check if user is admin
    if (!user || user.role !== "admin") {
      alert("Unauthorized access. Admin privileges required.");
      navigate("/products");
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!name || !description || !price || !image) {
      alert("Please fill in all fields and select an image file.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("image", image);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/products/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
      setName("");
      setDescription("");
      setPrice("");
      setImage(null);
      setImageName("");
      navigate("/products");
    } catch (error) {
      console.error(error);
      alert("Failed to add product. Please check input parameters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerPageStyle}>
      <div className="card" style={formCardStyle}>
        <div style={headerStyle}>
          <span style={{ fontSize: "36px" }} role="img" aria-label="admin">🛡️</span>
          <h1 style={titleStyle}>Add New Product</h1>
          <p style={subtitleStyle}>Publish a new handmade pipe cleaner bouquet to the catalog.</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Product Name */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Product Name</label>
            <div style={inputWithIconStyle}>
              <FiTag style={inputIconStyle} />
              <input
                type="text"
                placeholder="e.g. Lavender Dream Bouquet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Description</label>
            <div style={inputWithIconStyle}>
              <FiFileText style={{ ...inputIconStyle, top: "24px" }} />
              <textarea
                placeholder="Describe the flowers, colors, and wrap design..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ ...inputStyle, height: "120px", resize: "none" }}
                required
              />
            </div>
          </div>

          {/* Price */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Price (INR)</label>
            <div style={inputWithIconStyle}>
              <FiDollarSign style={inputIconStyle} />
              <input
                type="number"
                placeholder="999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          {/* File Upload wrapper */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Bouquet Image File</label>
            <div style={fileUploadWrapperStyle}>
              <FiImage size={24} style={{ color: "var(--text-secondary)" }} />
              <div style={{ textAlign: "left" }}>
                <strong style={{ fontSize: "14px", display: "block" }}>
                  {imageName ? imageName : "Choose a product image"}
                </strong>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                  Supports PNG, JPG, JPEG up to 5MB
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={fileInputStyle}
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={submitBtnStyle}
          >
            <FiPlusCircle /> {loading ? "Adding Product..." : "Publish Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Styling definitions
const containerPageStyle = {
  background: "linear-gradient(135deg, #FAF8F6 0%, #F5F1FF 100%)",
  minHeight: "calc(100vh - 70px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
};

const formCardStyle = {
  width: "100%",
  maxWidth: "540px",
  padding: "40px",
  background: "#FFF",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "32px",
};

const titleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "28px",
  fontWeight: "700",
  marginTop: "12px",
  marginBottom: "8px",
  color: "var(--text)",
};

const subtitleStyle = {
  fontSize: "13px",
  color: "var(--text-secondary)",
  lineHeight: "1.5",
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
  fontSize: "12px",
  fontWeight: "700",
  color: "var(--text)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const inputWithIconStyle = {
  position: "relative",
  width: "100%",
};

const inputIconStyle = {
  position: "absolute",
  left: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "var(--text-secondary)",
  pointerEvents: "none",
};

const inputStyle = {
  paddingLeft: "42px",
};

const fileUploadWrapperStyle = {
  position: "relative",
  border: "2px dashed var(--border)",
  borderRadius: "var(--radius-sm)",
  padding: "20px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  background: "var(--bg-cream)",
  cursor: "pointer",
  transition: "var(--transition)",
  ":hover": {
    borderColor: "var(--primary)",
  },
};

const fileInputStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  opacity: 0,
  cursor: "pointer",
};

const submitBtnStyle = {
  width: "100%",
  padding: "16px",
  fontSize: "15px",
  marginTop: "10px",
};

export default AddProduct;