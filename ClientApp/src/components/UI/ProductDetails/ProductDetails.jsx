import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import { Button } from 'reactstrap';
import style from './style.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails } from '../../../redux/productsSlice';
import { incrementTag } from '../../../redux/recommendedProductsSlice';
import { addItem } from '../../../redux/cartSlice';
import { Container } from '@mui/material';

export default function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useSelector((state) => state.products.productDetails[id]);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (product && product.tags) {
      product.tags.forEach((tag) => {
        dispatch(incrementTag(tag));
      });
    }
  }, [product, dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found.</div>;
  }

  const dividerSX = {
    height: '3px',
    backgroundColor: '#000',
  };

  return (
    <div className={style.productDetailsContainer}>
      <img className={style.image} src={`ProductImages/${product.imageUrl}`} alt={product.name} />
      <h2>{product.name}</h2>
      <Divider sx={dividerSX} />
      <p>Price: ${product.price}</p>
      <Divider sx={dividerSX} />
      <p>Amount: {product.amount}</p>
      <Container sx={{
        display: "flex",
        justifyContent: "space-around"
      }}>
        <Button variant="contained" color="primary" onClick={() => {
          dispatch(addItem({ productId: product.id, quantity: 1, product: product }));
        }}>
          Add To Cart
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
          Back to Products
        </Button>
      </Container>
    </div>
  );
}
