import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const isAdmin = useSelector(state => state.user.isAdmin);

  useEffect(() => {
      if (!isAdmin) {
        navigate("/admin/auth/");
      }
  }, [navigate,isAdmin]);

  return <div>{children}</div>;
}
