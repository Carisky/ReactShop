// ProductDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import { Button } from 'reactstrap';
import style from './style.module.css';
import PaymentModal from '../../Forms/PaymentModal/PaymentModal';
import ProductsService from '../../../Services/ProductsService';

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async (productId) => {
      try {
        const productData = await ProductsService.fetchProductDetails(productId);
        setProduct(productData);

        // You can add logic here to handle tags if needed
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails(id);
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const dividerSX = {
    height: '3px',
    backgroundColor: '#000',
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <div className={style.productDetailsContainer}>
      <img className={style.image} src={`ProductImages/${product.imageUrl}`} alt={product.name} />
      <h2>{product.name}</h2>
      <Divider sx={dividerSX} />
      <p>Price: ${product.price}</p>
      <Divider sx={dividerSX} />
      <p>Amount: {product.amount}</p>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Payment Form
      </Button>
      <PaymentModal open={openModal} handleClose={handleClose} />
      <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
        Back to Products
      </Button>
    </div>
  );
}
