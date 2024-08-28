// src/components/Header.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom p-3 ">
        <Link className="navbar-brand" to="/"></Link>

        <div
          className=" navbar-collapse d-flex justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {auth.isAuthenticated ? (
              <li
                style={{ cursor: "pointer" }}
                className="nav-item active align-items-center ps-3  d-flex justify-content-center cursor-pointer"
                onClick={() => logout()}
              >
                Logout
              </li>
            ) : (
              <>
                <li className="nav-item ps-3  ">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item ps-3  ">
                  <Link className="nav-link" to="/signup">
                    SignUp
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
