import React, { useEffect } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminNavMenu } from './Admin/Components/AdminNavMenu/AdminNavMenu';
import { useSelector } from 'react-redux';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './SideBar/SideBar';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isAdminPath = currentPath.includes("admin");
  const isAdmin = useSelector(state => state.user.isAdmin);

  useEffect(() => {
    if (isAdminPath && !isAdmin){
      navigate('admin/auth');
      return null;
    }
    if (isAdminPath && isAdmin){
      navigate('admin/');
      return null;
    }
  }, [isAdmin, isAdminPath, navigate]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {isAdmin && isAdminPath ? <AdminNavMenu /> : <NavMenu />}
        <Container tag="main">
          {children}
        </Container>
      </Box>
    </Box>
  );
}
