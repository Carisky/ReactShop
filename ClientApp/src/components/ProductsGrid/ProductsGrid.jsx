import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from './style.module.css';
import Product from '../UI/Product/Product';
import { fetchProducts } from '../../redux/productsSlice';

const ProductsGrid = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.filteredProducts);
  const productStatus = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [productStatus, dispatch]);

  return (
    <div className={style.gridContainer}>
      {error ? (
        <p>Error fetching products: {error}</p>
      ) : (
        products.map((product) => (
          <Product key={product.id} product={product} />
        ))
      )}
    </div>
  );
};

export default ProductsGrid;
