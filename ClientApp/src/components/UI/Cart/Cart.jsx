import React, { useEffect, useState } from "react";
import CartService from "../../../Services/CartService";
import axios from "axios"; 
import ProductPreview from "../ProductPreview/ProductPreview";
import style from "./style.module.css";
import { Button } from "@mui/material";
import PaymentModal from "../../Forms/PaymentModal/PaymentModal";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    async function fetchCartItems() {
      const cart = CartService.getCart();
      if (cart.length > 0) {
        const productIds = cart.map((item) => item.productId);
        try {
          const response = await axios.post("/products/ids", productIds);
          const products = response.data;
          const cartWithDetails = cart.map((cartItem) => {
            const product = products.find((p) => p.id === cartItem.productId);
            return {
              ...cartItem,
              product,
            };
          });
          setCartItems(cartWithDetails);
        } catch (error) {
          console.error("Failed to fetch product details", error);
        }
      }
      setLoading(false);
    }

    fetchCartItems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={style.cartGrid}>
        {cartItems.map((item) => (
          <ProductPreview key={item.productId} item={item} />
        ))}
      </div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Payment Form
      </Button>
      <PaymentModal open={openModal} handleClose={handleClose} />
    </>
  );
}
