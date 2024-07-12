import React, { useEffect } from 'react';
import axios from 'axios';
import UserService from '../../../../Services/UserService';


export default function AdminHome() {
  useEffect(() => {
    const token = UserService.getUser();

    axios.get('/auth/admin-only', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }, []);

  return (
    <div>
      admin
    </div>
  );
}
