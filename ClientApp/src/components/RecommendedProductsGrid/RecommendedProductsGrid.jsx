import React, { useEffect, useState } from 'react';
import style from './style.module.css'; // CSS module for styling
import Product from '../UI/Product/Product';
import RecomendedProducts from '../../Services/RecomendedProducts';
import axios from 'axios';

const RecommendedProductsGrid = () => {

    const [recomendedProducts, setRecomendedProducts] = useState([]);

    useEffect(() => {
        fetchRecomendedProducts();
      }, []);


    const fetchRecomendedProducts = async () => {
        try {
          const tags = RecomendedProducts.getMostVisited(3).map((tag) => tag.tag);
          const response = await axios.post(
            "/recommendedproducts",
            { tags }
          );
          setRecomendedProducts(response.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

  return (
    <div>
      <h2>Recommended Products</h2>
      <div className={style.gridContainer}>
        {recomendedProducts.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedProductsGrid;
