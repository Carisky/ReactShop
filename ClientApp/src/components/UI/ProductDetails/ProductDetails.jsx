import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; 
import Divider from "@mui/material/Divider";
import { Button } from "reactstrap";
import style from "./style.module.css";
import PaymentModal from "../../Forms/PaymentModal/PaymentModal";
import RecomendedProducts from "../../../Services/RecomendedProducts";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false); 
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails(id);
  }, [id]);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(`/products/${productId}`);
      const productData = response.data;
      setProduct(productData);

      // Iterate over each tag and increment its count
      if (productData.tags && productData.tags.length > 0) {
        productData.tags.forEach(tag => RecomendedProducts.increment(tag));
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const dividerSX = {
    height: "3px",
    backgroundColor: "#000",
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <div className={style.productDetailsContainer}>
      <img className={style.image} src={`https://localhost:7200/ProductImages/${product.imageUrl}`} alt={product.name} />
      <h2>{product.name}</h2>
      <Divider sx={dividerSX} />
      <p>Price: ${product.price}</p>
      <Divider sx={dividerSX} />
      <p>Amount: {product.amount}</p>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Payment Form
      </Button>
      <PaymentModal open={openModal} handleClose={handleClose} /> 
      <Button variant="contained" color="secondary" onClick={() => navigate("/")}>
        Back to Products
      </Button>
    </div>
  );
}
