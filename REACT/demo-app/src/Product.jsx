import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then(response => {
        console.log("Products fetched:", response.data);
        setProducts(response.data);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product List</h2>

      {products.map(product => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "8px",
            width: "300px"
          }}
        >
          <h3>{product.title}</h3>
          <img
            src={product.image}
            alt={product.title}
            width="120"
            style={{ display: "block", marginBottom: "10px" }}
          />
          <p>{product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default Product;
