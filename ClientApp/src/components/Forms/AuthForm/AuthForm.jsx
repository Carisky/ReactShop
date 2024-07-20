import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { errors } } = useForm();

  const handleFormSubmit = async (formData) => {
    try {
      const response = await axios.post("/auth/login", formData);
      const { token } = response.data;
      dispatch(setUser(token));
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div style={{ width: "25vw", margin: "auto" }}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{ required: "Username is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Username"
                variant="outlined"
                error={!!errors.username}
                helperText={errors.username ? errors.username.message : ""}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
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
