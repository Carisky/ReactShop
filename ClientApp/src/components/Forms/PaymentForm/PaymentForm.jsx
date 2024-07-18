import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import CartService from '../../../Services/CartService';
import { useNavigate } from 'react-router-dom';

const PaymentForm = () => {
  const paypalRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    const cartItems = CartService.getCart();

    axios.post('/Order/CheckStock', cartItems)
      .then(response => {
        const { totalPrice } = response.data;
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: totalPrice.toString() 
                }
              }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
              const fullname = details.payer.name.given_name + ' ' + details.payer.name.surname;
              const address = details.purchase_units[0].shipping.address;
              const email = details.payer.email_address;
              const orderData = {
                fullname,
                email,
                address: `${address.address_line_1}, ${address.admin_area_2}, ${address.admin_area_1}, ${address.postal_code}, ${address.country_code}`,
                items: cartItems
              };

              axios.post('/Order/CreateOrder', orderData)
                .then(response => {
                  alert('Order successfully created and transaction completed by ' + details.payer.name.given_name);
                  CartService.clearCart();
                  
                })
                .catch(error => {
                  console.error('Error creating order:', error);
                });
            });
          },
          onError: (err) => {
            console.error(err);
          }
        }).render(paypalRef.current);
      })
      .catch(error => {
        console.error('Error checking stock or calculating total price:', error);
      });
  }, []);

  return (
    <div>
      <div ref={paypalRef} />
    </div>
  );
};

export default PaymentForm;
