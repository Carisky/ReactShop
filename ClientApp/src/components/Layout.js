import React, { useEffect } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminNavMenu } from './Admin/Components/AdminNavMenu/AdminNavMenu';
import { useSelector } from 'react-redux';

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
  }, []);
  

  return (
    <div>
      {isAdmin && isAdminPath ? <AdminNavMenu /> : <NavMenu />}
      <Container tag="main">
        {children}
      </Container>
    </div>
  );
}
