import { Link, useNavigate } from "react-router-dom";
import "../CSS/Footer.css";

export default function Footer() {
  const navigate = useNavigate();

  const handleServices = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login", {
        state: {
          redirectTo: "/user/dashboard",
          loginType: "CUSTOMER"
        }
      });
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const role = user.role?.toUpperCase();

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (
        role === "CUSTOMER" ||
        role === "USER"
      ) {
        navigate("/user/dashboard");
      } else if (role === "JOB_SEEKER") {
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("Footer user error:", error);
      navigate("/login", {
        state: {
          redirectTo: "/user/dashboard",
          loginType: "CUSTOMER"
        }
      });
    }
  };

  const handleJobs = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login", {
        state: {
          redirectTo: "/job-dashboard",
          loginType: "JOB_SEEKER"
        }
      });
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const role = user.role?.toUpperCase();

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "JOB_SEEKER") {
        navigate("/job-dashboard");
      } else if (
        role === "CUSTOMER" ||
        role === "USER"
      ) {
        navigate("/login", {
          state: {
            redirectTo: "/job-dashboard",
            loginType: "JOB_SEEKER"
          }
        });
      }
    } catch (error) {
      console.error("Footer user error:", error);
      navigate("/login", {
        state: {
          redirectTo: "/job-dashboard",
          loginType: "JOB_SEEKER"
        }
      });
    }
  };

  return (
    <footer className="footer">

      {/* =================================================
          FOOTER MAIN
      ================================================= */}

      <div className="footer-container">

        {/* BRAND */}

        <div className="footer-section footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >
            Service<span>Book</span>
          </Link>

          <p>
            Your trusted platform for home services
            and job opportunities.
          </p>

          <div className="footer-socials">

            <a
              href="#"
              aria-label="Facebook"
            >
              f
            </a>

            <a
              href="#"
              aria-label="Instagram"
            >
              ◎
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
            >
              in
            </a>

            <a
              href="#"
              aria-label="Twitter"
            >
              X
            </a>

          </div>

        </div>


        {/* QUICK LINKS */}

        <div className="footer-section">

          <h3>
            Quick Links
          </h3>

          <Link to="/">
            Home
          </Link>

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

        </div>


        {/* FOR CUSTOMERS */}

        <div className="footer-section">

          <h3>
            For Customers
          </h3>

          <button onClick={handleServices}>
            Book a Service
          </button>

          <Link to="/my-bookings">
            My Bookings
          </Link>

          <Link to="/user/dashboard">
            Customer Dashboard
          </Link>

        </div>


        {/* FOR JOB SEEKERS */}

        <div className="footer-section">

          <h3>
            For Job Seekers
          </h3>

          <button onClick={handleJobs}>
            Find a Job
          </button>

          <Link to="/jobs">
            Browse Jobs
          </Link>

          <Link to="/my-applications">
            My Applications
          </Link>

          <Link to="/job-dashboard">
            Job Dashboard
          </Link>

        </div>

      </div>


      {/* =================================================
          FOOTER BOTTOM
      ================================================= */}

      <div className="footer-bottom">

        <div className="footer-bottom-container">

          <p>
            © {new Date().getFullYear()} ServiceBook.
            All rights reserved.
          </p>

          <div className="footer-bottom-links">

            <Link to="/">
              Privacy Policy
            </Link>

            <Link to="/">
              Terms & Conditions
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}
