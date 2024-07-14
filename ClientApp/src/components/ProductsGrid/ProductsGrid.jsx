// ProductsGrid.js
import React, { useState, useEffect } from 'react';
import style from './style.module.css';
import Product from '../UI/Product/Product';
import ProductsService from '../../Services/ProductsService';

const ProductsGrid = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await ProductsService.fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={style.gridContainer}>
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
