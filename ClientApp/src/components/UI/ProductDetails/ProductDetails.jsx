import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Divider from "@mui/material/Divider";
import { Button } from "reactstrap";
import style from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../../../redux/productsSlice";
import { incrementTag } from "../../../redux/recommendedProductsSlice";
import { validateToken } from "../../../redux/userSlice";
import { addItem } from "../../../redux/cartSlice";
import { Container, Box, Rating, Typography } from "@mui/material";
import LoginModal from "../../Forms/LoginModal/LoginModal";
import ReviewModal from "../../Forms/ReviewModal/ReviewModal";

export default function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useSelector((state) => state.products.productDetails[id]);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const token = useSelector((state) => state.user.token);
  const [ratingValue, setRatingValue] = useState(2);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsError, setReviewsError] = useState("");

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/Review/product/${id}`);
        const reviewsData = response.data;
        setReviews(reviewsData);

        if (reviewsData.length > 0) {
          const totalRating = reviewsData.reduce((acc, review) => acc + review.rating, 0);
          const averageRating = totalRating / reviewsData.length;
          setRatingValue(averageRating);  
        }
      } catch (error) {
        setReviewsError(error.message);
      }
    };

    fetchReviews();
  }, [id]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found.</div>;
  }

  const handleRatingChange = async (event, newValue) => {
    const resultAction = await dispatch(validateToken(token));
    const authorized = resultAction.payload;

    if (authorized) {
      setRatingValue(newValue);
      setReviewModalOpen(true); // Open review modal
    } else {
      setLoginModalOpen(true); // Open login modal
    }
  };

  const dividerSX = {
    height: "3px",
    backgroundColor: "#000",
  };

  return (
    <div className={style.productDetailsContainer}>
      <img
        className={style.image}
        src={`ProductImages/${product.imageUrl}`}
        alt={product.name}
      />
      <h2>{product.name}</h2>
      <Divider sx={dividerSX} />
      <p>Price: ${product.price}</p>
      <Divider sx={dividerSX} />
      <p>Amount: {product.amount}</p>

      <Box sx={{ "& > legend": { mt: 2 } }}>
        <Typography component="legend">Rate this product</Typography>
        <Rating
          name="simple-controlled"
          value={ratingValue}
          onChange={handleRatingChange}
        />
      </Box>

      <Container sx={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            dispatch(
              addItem({ productId: product.id, quantity: 1, product: product })
            );
          }}
        >
          Add To Cart
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/")}
        >
          Back to Products
        </Button>
      </Container>

      {reviewsError && <div>Error: {reviewsError}</div>}
      {reviews.length > 0 ? (
        <div className={style.reviewsContainer}>
          <h3>Customer Reviews</h3>
          {reviews.map((review) => (
            <div key={review.id} className={style.review}>
              <Rating value={review.rating} readOnly />
              <p>{review.reviewPlot}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews yet. Be the first to review this product!</p>
      )}

      {/* Login Modal */}
      <LoginModal open={loginModalOpen} handleClose={() => setLoginModalOpen(false)} />

      {/* Review Modal */}
      <ReviewModal
        open={reviewModalOpen}
        handleClose={() => setReviewModalOpen(false)}
        ratingValue={ratingValue}
        productId={id}
      />
    </div>
  );
}
