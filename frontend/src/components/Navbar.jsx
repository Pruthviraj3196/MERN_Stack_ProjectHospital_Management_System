import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GiHamburgerMenu } from "react-icons/gi";
import { Context } from "../main";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/v1/user/patient/logout", {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setIsAuthenticated(false);
      setUser({});
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="container">
      <div className="logo">
        <img src="/logo.png" alt="logo" className="logo-img" />
      </div>
      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          <Link to="/" onClick={() => setShow(false)}>Home</Link>
          <Link to="/appointment" onClick={() => setShow(false)}>Appointment</Link>
          <Link to="/about" onClick={() => setShow(false)}>About Us</Link>
        </div>
        {isAuthenticated ? (
          <button className="logoutBtn btn" onClick={handleLogout}>
            LOGOUT
          </button>
        ) : (
          <button className="loginBtn btn" onClick={() => navigate("/login")}>
            LOGIN
          </button>
        )}
      </div>
      <div className="hamburger" onClick={() => setShow(!show)}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
