
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import { Button } from 'reactstrap';
import style from './style.module.css';
import ProductsService from '../../../Services/ProductsService';
import RecomendedProducts from '../../../Services/RecomendedProducts';
import CartService from '../../../Services/CartService';
import { Container } from '@mui/material';

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async (productId) => {
      try {
        const productData = await ProductsService.fetchProductDetails(productId);
        setProduct(productData);
        productData.tags.map((tag)=>{
          RecomendedProducts.increment(tag)
        })

        
        
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


  return (
    <div className={style.productDetailsContainer}>
      <img className={style.image} src={`ProductImages/${product.imageUrl}`} alt={product.name} />
      <h2>{product.name}</h2>
      <Divider sx={dividerSX} />
      <p>Price: ${product.price}</p>
      <Divider sx={dividerSX} />
      <p>Amount: {product.amount}</p>
      <Container sx={{
        display:"flex",
        justifyContent:"space-around"
      }}>
      <Button variant="contained" color="primary" onClick={()=>{
        CartService.addItem(product.id, 1);
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
