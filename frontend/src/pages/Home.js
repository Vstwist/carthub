import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
      }}
    >
      <h1>Welcome to V's Twist</h1>

      <p>
        Discover beautiful handmade Pipe Cleaner Art.
      </p>

      <br />

      <Link to="/login">
        <button style={{ marginRight: "10px" }}>
          Login
        </button>
      </Link>

      <Link to="/register">
        <button>
          Register
        </button>
      </Link>
    </div>
  );
}

export default Home;