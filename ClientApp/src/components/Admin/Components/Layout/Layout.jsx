import React, { useEffect } from "react";
import UserService from "../../../../Services/UserService";
import {useNavigate} from "react-router-dom"
export default function Layout({ children }) {

    const navigate = useNavigate()

    const validate = async () => {
        const isValid = await UserService.validateAdmin();
        console.log(isValid)
        if (!isValid) {
            console.log(UserService.getUser())
            navigate("/admin/auth/")
        }
      };

  useEffect(() => {
    validate()
  }, []);

  return <div>{children}</div>;
}
