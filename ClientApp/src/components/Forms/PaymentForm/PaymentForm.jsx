
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkStock, createPayPalButtons } from '../../../utils/paymentUtils';
import { clearCart } from '../../../redux/cartSlice';

const PaymentForm = () => {
  const paypalRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  useEffect(() => {
    const initializePayPal = async () => {
      try {
        const { totalPrice } = await checkStock(cartItems);

        const handleOrderCreation = async (details) => {
          const fullname = details.payer.name.given_name + ' ' + details.payer.name.surname;
          const address = details.purchase_units[0].shipping.address;
          const email = details.payer.email_address;
          const orderData = {
            fullname,
            email,
            address: `${address.address_line_1}, ${address.admin_area_2}, ${address.admin_area_1}, ${address.postal_code}, ${address.country_code}`,
            items: cartItems,
          };

          try {
            await axios.post('/Order/CreateOrder', orderData);
            dispatch(clearCart());

          } catch (error) {
            console.error('Error creating order:', error);
          }
        };

        createPayPalButtons(paypalRef, totalPrice, cartItems, handleOrderCreation);
      } catch (error) {
        console.error(error.message);
      }
    };

    initializePayPal();
  }, [cartItems, dispatch, navigate]);

  return (
    <div>
      <div ref={paypalRef} />
    </div>
  );
};

export default PaymentForm;
