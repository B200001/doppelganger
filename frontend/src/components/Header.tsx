import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../store/userSlice';
import { clearAdmin } from '../store/adminSlice';
import { RootState } from '../store';
import '../styles/Header.scss';
import logo from "../assets/csa_logo.jpg";
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const adminToken = useSelector((state: RootState) => state.admin.token);

  const handleUserLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem('token');
  };

  const handleAdminLogout = () => {
    dispatch(clearAdmin());
    localStorage.removeItem('adminToken');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="header">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!currentUser && !adminToken && (
              <>
                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                <Nav.Link as={NavLink} to="/about">About Us</Nav.Link>
                <Nav.Link as={NavLink} to="/projects">Our Projects</Nav.Link>
                <Nav.Link as={NavLink} to="/resources">Get Started</Nav.Link>
              </>
            )}
            {adminToken ? (
              <>
                <Nav.Link as={NavLink} to="/admin/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                <Nav.Link as={NavLink} to="/about">About Us</Nav.Link>
                <Nav.Link as={NavLink} to="/projects">Our Projects</Nav.Link>
                <Nav.Link as={NavLink} to="/resources">Get Started</Nav.Link>
                <Button variant="outline-light" onClick={handleAdminLogout} className="ms-2">Logout</Button>
              </>
            ) : currentUser ? (
              <>
                <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                <Nav.Link as={NavLink} to="/about">About Us</Nav.Link>
                <Nav.Link as={NavLink} to="/projects">Our Projects</Nav.Link>
                <Nav.Link as={NavLink} to="/resources">Get Started</Nav.Link>
                <Nav.Link as={NavLink} to="/participate">Participate</Nav.Link>
                <Button variant="outline-light" onClick={handleUserLogout} className="ms-2">Logout</Button>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
