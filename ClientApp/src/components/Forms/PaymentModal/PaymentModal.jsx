import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import PaymentForm from '../PaymentForm/PaymentForm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function PaymentModal({ open, handleClose }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="payment-modal-title"
      aria-describedby="payment-modal-description"
    >
      <Box sx={style}>
        <h2 id="payment-modal-title">Payment Form</h2>
        <PaymentForm />
      </Box>
    </Modal>
  );
}
