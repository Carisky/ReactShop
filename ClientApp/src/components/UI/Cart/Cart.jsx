import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProductPreview from '../ProductPreview/ProductPreview';
import style from './style.module.css';
import { Button } from '@mui/material';
import PaymentModal from '../../Forms/PaymentModal/PaymentModal';
import { updateCartWithDetails } from '../../../redux/cartSlice';

export default function Cart() {
  const { items: cartItems, status, error } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = React.useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(updateCartWithDetails());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className={style.cartGrid}>
        {cartItems.map((item) => (
          <ProductPreview
            key={item.productId}
            item={item}
          />
        ))}
      </div>
      <div className={style.buttonContainer}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Pay
        </Button>
      </div>
      <PaymentModal open={openModal} handleClose={handleClose} />
    </>
  );
}
