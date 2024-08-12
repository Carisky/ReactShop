import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const LoginModal = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <TextField label="Username" fullWidth margin="dense" />
        <TextField label="Password" type="password" fullWidth margin="dense" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleClose} color="primary">Login</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;
