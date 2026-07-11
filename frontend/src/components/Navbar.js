import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header>
      <h1>V's Twist</h1>

      <nav>
        <Link to="/products">
          <button>Products</button>
        </Link>

        {user?.role === "admin" && (
          <Link to="/add-product">
            <button>Add Product</button>
          </Link>
        )}

        <Link to="/cart">
          <button>Cart 🛒</button>
        </Link>

        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}

export default Navbar;