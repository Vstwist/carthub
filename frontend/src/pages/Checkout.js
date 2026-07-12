import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });


  useEffect(() => {

    if (!user) {
      navigate("/login");
      return;
    }

    axios
    .get(`${process.env.REACT_APP_API_URL}/api/cart/${user.id}`)
      .then((res) => {
        setCart(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);


  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );


  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };


  const placeOrder = async () => {

    if (
      !formData.customer_name ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {

      alert("Please fill all fields");

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

          pincode: formData.pincode
        }
      );

      alert(response.data.message);

      navigate("/order-success");

    } catch (err) {

      console.log(err);

      alert("Order Failed");

    } finally {

      setLoading(false);

    }

  };
    return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Checkout
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
        }}
      >
        {/* Customer Details */}

        <div>
          <h3>Delivery Details</h3>

          <input
            type="text"
            name="customer_name"
            placeholder="Full Name"
            value={formData.customer_name}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            style={{
              ...inputStyle,
              height: "90px",
              resize: "none",
            }}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Order Summary */}

        <div>
          <h3>Order Summary</h3>

          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "10px",
              }}
            >
              <div>
                <strong>{item.name}</strong>
                <br />
                Qty: {item.quantity}
              </div>

              <div>
                ₹{Number(item.price) * item.quantity}
              </div>
            </div>
          ))}

          <h2>Total : ₹{total}</h2>

          <button
            onClick={placeOrder}
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "20px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "17px",
            }}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "16px",
  boxSizing: "border-box",
};

export default Checkout;