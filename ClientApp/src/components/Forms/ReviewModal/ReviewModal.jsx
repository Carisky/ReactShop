import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
const ReviewModal = ({ open, handleClose, ratingValue, productId }) => {
  const [reviewPlot, setReviewPlot] = useState('');
  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.token);
  const handleSubmit = async () => {
    // Data to be sent to the backend
    const reviewData = {
      userId: userId,
      productId: productId,
      rating: ratingValue,
      reviewPlot: reviewPlot,
    };

    try {
        const config = {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          };
      // Sending the review data to the backend using axios
      const response = await axios.post('/Review', reviewData,config);

      if (response.status === 200) {
        console.log('Review submitted successfully:', response.data);
        handleClose(); // Close the modal on success
      } else {
        console.log('Failed to submit review:', response);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Submit Your Review</DialogTitle>
      <DialogContent>
        <Typography>Your Rating: {ratingValue}</Typography>
        <TextField
          label="Your Review"
          multiline
          rows={4}
          fullWidth
          margin="dense"
          value={reviewPlot}
          onChange={(e) => setReviewPlot(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;
