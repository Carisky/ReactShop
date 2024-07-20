// src/utils/paymentUtils.js

import axios from 'axios';

export const checkStock = async (cartItems) => {
  try {
    const response = await axios.post('/Order/CheckStock', cartItems);
    return response.data;
  } catch (error) {
    throw new Error('Error checking stock or calculating total price: ' + error.message);
  }
};

export const createPayPalButtons = (paypalRef, totalPrice, cartItems, handleOrderCreation) => {
  window.paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: totalPrice.toString(),
          },
        }],
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(details => {
        handleOrderCreation(details);
      });
    },
    onError: (err) => {
      console.error(err);
    },
  }).render(paypalRef.current);
};
