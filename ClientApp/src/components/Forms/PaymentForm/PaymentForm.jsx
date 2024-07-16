import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";

function validateCreditCard(number) {
  const sanitized = number.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export default function PaymentForm({ onSubmit }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = (formData) => {
    onSubmit(formData); 
  };

  return (
    <div
      style={{ 
        width: "25vw",
        margin: "auto",
      }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Controller
            name="fullname"
            control={control}
            defaultValue=""
            rules={{ required: "Fullname is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Fullname"
                variant="outlined"
                error={!!errors.fullname}
                helperText={errors.fullname ? errors.fullname.message : ""}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: "Address is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address"
                variant="outlined"
                error={!!errors.address}
                helperText={errors.address ? errors.address.message : ""}
              />
            )}
          />
          <Controller
            name="cvv"
            control={control}
            defaultValue=""
            rules={{
              required: "CVV is required",
              minLength: { value: 3, message: "CVV must be at least 3 digits" },
              maxLength: { value: 4, message: "CVV must be at most 4 digits" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="CVV"
                variant="outlined"
                error={!!errors.cvv}
                helperText={errors.cvv ? errors.cvv.message : ""}
              />
            )}
          />
          <Controller
            name="expiryDate"
            control={control}
            defaultValue=""
            rules={{ required: "Expiry Date is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Expire Date"
                variant="outlined"
                error={!!errors.expiryDate}
                helperText={errors.expiryDate ? errors.expiryDate.message : ""}
              />
            )}
          />
          <Controller
            name="cardNumber"
            control={control}
            defaultValue=""
            rules={{
              required: "Card Number is required",
              minLength: { value: 16, message: "Card Number must be 16 digits" },
              validate: value =>
                validateCreditCard(value) || "Invalid Card Number",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Card Number"
                variant="outlined"
                error={!!errors.cardNumber}
                helperText={errors.cardNumber ? errors.cardNumber.message : ""}
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
