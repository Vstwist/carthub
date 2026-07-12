import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

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
        
       const addToCart = async (productId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }

    const response = await axios.post(
      "http://localhost:5000/api/cart/add",
      {
        user_id: user.id,
        product_id: productId,
      }
    );

    alert(response.data.message);
  } catch (error) {
    console.error(error);
    alert("Failed to add to cart");
  }
};   
    const deleteProduct = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  try {
    const response = await axios.delete(
      `http://localhost:5000/api/products/${id}`
    );

    alert(response.data.message);

    fetchProducts();
  } catch (error) {
    console.error(error);
    alert("Failed to delete product");
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Our Products</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              width: "250px",
              background: "#fff",
            }}
          >
            <img
             src={`${process.env.REACT_APP_API_URL}/uploads/${product.image}`}
             alt={product.name}
             style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px" }}
             />  
          

            <h3>{product.name}</h3>

            <p>{product.description}</p>

            <h4>₹{product.price}</h4>

            <button onClick={() => addToCart(product.id)}>
            Add to Cart
            </button>

            {user && user.role === "admin" && (
           <button
           onClick={() => deleteProduct(product.id)}
           style={{
           marginTop: "10px",
           width: "100%",
           padding: "10px",
           background: "red",
           color: "white",
           border: "none",
           borderRadius: "5px",
           cursor: "pointer",
           }}
           >
           Delete Product
           </button>
           )}
            
          
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;