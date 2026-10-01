
import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import { toast } from "react-toastify";
import "../CSS/Header.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  // =====================================================
  // CHECK AUTHENTICATION
  // =====================================================

  useEffect(() => {

    const checkUser = () => {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(
          JSON.parse(storedUser)
        );
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        setUser(null);
      }
    };

    checkUser();

    window.addEventListener(
      "authChanged",
      checkUser
    );

    return () => {
      window.removeEventListener(
        "authChanged",
        checkUser
      );
    };

  }, [location.pathname]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    setUser(null);

    window.dispatchEvent(
      new Event("authChanged")
    );

    toast.success(
      "Logged out successfully"
    );

    navigate("/");
  };

  const role =
    user?.role?.toUpperCase();

  return (
    <header className="header">

      {/* LOGO */}

      <div className="header-logo">

        <Link to="/">
          ServiceBook
        </Link>

      </div>


      <nav className="header-nav">

        {/* ==========================================
            HOME
        ========================================== */}

        <Link to="/">
          Home
        </Link>


        {/* ==========================================
            NOT LOGGED IN
        ========================================== */}

        {!user && (
          <>
            <Link to="/services">
              Services
            </Link>

            <Link to="/jobs">
              Jobs
            </Link>

            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}


        {/* ==========================================
            CUSTOMER
        ========================================== */}

        {user &&
        (role === "CUSTOMER" ||
          role === "USER") && (
          <>

            <Link to="/services">
              Services
            </Link>

            <Link to="/user/dashboard">
              Dashboard
            </Link>

            <Link to="/my-bookings">
              My Bookings
            </Link>

            <button
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </>
        )}


        {/* ==========================================
            JOB SEEKER
        ========================================== */}

        {user &&
        role === "JOB_SEEKER" && (
          <>

            <Link to="/jobs">
              Jobs
            </Link>

            <Link to="/job-dashboard">
              Dashboard
            </Link>

            <Link to="/my-applications">
              My Applications
            </Link>

            <button
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </>
        )}


        {/* ==========================================
            ADMIN
        ========================================== */}

        {user &&
        role === "ADMIN" && (
          <>

            <Link to="/admin">
              Admin Dashboard
            </Link>

            <button
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </>
        )}

      </nav>

    </header>
  );
}
