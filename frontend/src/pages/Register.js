import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Register | V's Twist";
  }, []);

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        { name, email, password }
      );

      alert(response.data.message);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerPageStyle}>
      <div className="card" style={registerCardStyle}>
        {/* Header Branding */}
        <div style={brandHeaderStyle}>
          <span style={{ fontSize: "36px" }} role="img" aria-label="flower">🌸</span>
          <h1 style={titleStyle}>Create Account</h1>
          <p style={subtitleStyle}>Join V's Twist to order premium pipe cleaner flower bouquets.</p>
        </div>

        <form onSubmit={handleRegister} style={formStyle}>
          {/* Name input */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Full Name</label>
            <div style={inputWithIconStyle}>
              <FiUser style={inputIconStyle} />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

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
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
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
            <FiUserPlus /> {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Navigation back to login */}
        <div style={footerStyle}>
          <span>Already have an account?</span>{" "}
          <Link to="/login" style={loginLinkStyle}>
            Login Here
          </Link>
        </div>
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

const registerCardStyle = {
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
  paddingLeft: "42px",
};

const submitBtnStyle = {
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

const loginLinkStyle = {
  color: "var(--primary)",
  fontWeight: "700",
  textDecoration: "underline",
};

export default Register;