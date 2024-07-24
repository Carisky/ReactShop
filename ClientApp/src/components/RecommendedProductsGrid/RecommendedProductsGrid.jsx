import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from './style.module.css'; 
import Product from '../UI/Product/Product';
import { fetchRecommendedProducts } from '../../redux/recommendedProductsSlice';

const RecommendedProductsGrid = () => {
  const dispatch = useDispatch();
  const recommendedProducts = useSelector((state) => state.recommendedProducts.recommendedProducts);
  const status = useSelector((state) => state.recommendedProducts.status);
  const tags = useSelector((state) => state.recommendedProducts.tags);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRecommendedProducts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (Object.keys(tags).length > 0) {
      dispatch(fetchRecommendedProducts());
    }
  }, [tags, dispatch]);

  

  return (
    <div>
      <h2>Recommended Products</h2>
      <div className={style.gridContainer}>
        {status === 'loading' && <p>Loading...</p>}
        {recommendedProducts && recommendedProducts.length > 0 ? (
          recommendedProducts.map((product) => (
            <Product key={product.id} product={product} />
          ))
        ) : (
          <p>No recommended products available.</p>
        )}
      </div>
    </div>
  );
};

export default RecommendedProductsGrid;
