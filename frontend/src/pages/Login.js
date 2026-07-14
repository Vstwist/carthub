import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | V's Twist";
  }, []);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        { email, password }
      );

      alert(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/products");
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Login failed. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerPageStyle}>
      <div className="card" style={loginCardStyle}>
        {/* Brand header */}
        <div style={brandHeaderStyle}>
          <span style={{ fontSize: "36px" }} role="img" aria-label="flower">🌸</span>
          <h1 style={titleStyle}>Welcome Back</h1>
          <p style={subtitleStyle}>Log in to manage your cart and view custom bouquets.</p>
        </div>

        <form onSubmit={handleLogin} style={formStyle}>
          {/* Email input */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <div style={inputWithIconStyle}>
              <FiMail style={inputIconStyle} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Password</label>
            <div style={inputWithIconStyle}>
              <FiLock style={inputIconStyle} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={loginBtnStyle}
          >
            <FiLogIn /> {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Register navigation link */}
        <div style={footerStyle}>
          <span>Don't have an account?</span>{" "}
          <Link to="/register" style={registerLinkStyle}>
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}

// Styling definitions
const containerPageStyle = {
  background: "linear-gradient(135deg, #FAF8F6 0%, #F5F1FF 100%)",
  minHeight: "calc(100vh - 70px)", // accounts for navbar size roughly
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
};

const loginCardStyle = {
  width: "100%",
  maxWidth: "420px",
  padding: "40px",
  background: "#FFF",
};

const brandHeaderStyle = {
  textAlign: "center",
  marginBottom: "30px",
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
  paddingLeft: "42px", // padding for icon spacer
};

const loginBtnStyle = {
  width: "100%",
  padding: "14px",
  fontSize: "15px",
  marginTop: "10px",
};

const footerStyle = {
  textAlign: "center",
  marginTop: "24px",
  fontSize: "13px",
  color: "var(--text-secondary)",
};

const registerLinkStyle = {
  color: "var(--primary)",
  fontWeight: "700",
  textDecoration: "underline",
};

export default Login;