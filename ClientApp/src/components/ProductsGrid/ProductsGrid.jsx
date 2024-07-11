import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './style.module.css'; // CSS module for styling
import Product from '../UI/Product/Product';

const ProductsGrid = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className={style.gridContainer}>
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
