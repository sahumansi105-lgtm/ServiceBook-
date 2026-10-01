
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../CSS/UserDashboard.css";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // AVAILABLE SERVICES
  // ==========================================

  const services = [
    {
      id: 1,
      name: "Carpenter",
      icon: "🪚",
      description:
        "Furniture repair and installation."
    },
    {
      id: 2,
      name: "Electrician",
      icon: "⚡",
      description:
        "Electrical repair and installation."
    },
    {
      id: 3,
      name: "Plumber",
      icon: "🔧",
      description:
        "Pipe, tap and plumbing services."
    },
    {
      id: 4,
      name: "AC Repair",
      icon: "❄️",
      description:
        "AC servicing and repair services."
    },
    {
      id: 5,
      name: "Cleaning",
      icon: "🧹",
      description:
        "Home and deep cleaning services."
    },
    {
      id: 6,
      name: "Painting",
      icon: "🎨",
      description:
        "Home painting and wall touch-ups."
    }
  ];

  // ==========================================
  // FETCH BOOKINGS
  // ==========================================

  const fetchBookings = async (userId) => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/api/bookings/user/${userId}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch bookings"
        );
      }

      const data = await response.json();

      console.log(
        "User bookings:",
        data
      );

      setBookings(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {
      console.error(
        "Booking fetch error:",
        error
      );

      toast.error(
        "Unable to load booking details"
      );

      setBookings([]);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGIN + ROLE CHECK
  // ==========================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    // ------------------------------------------
    // NOT LOGGED IN
    // ------------------------------------------

    if (!storedUser) {
      toast.warning(
        "Please login first"
      );

      navigate("/login", {
        state: {
          redirectTo:
            "/user/dashboard",
          loginType:
            "CUSTOMER"
        }
      });

      return;
    }

    try {
      const parsedUser =
        JSON.parse(storedUser);

      const role =
        parsedUser.role?.toUpperCase();

      console.log(
        "User Dashboard Role:",
        role
      );

      // ------------------------------------------
      // ADMIN
      // ------------------------------------------

      if (role === "ADMIN") {
        navigate("/admin");
        return;
      }

      // ------------------------------------------
      // JOB SEEKER
      // ------------------------------------------

      if (role === "JOB_SEEKER") {
        toast.warning(
          "This is a Job Seeker account. Please use the Job Dashboard."
        );

        navigate(
          "/job-dashboard"
        );

        return;
      }

      // ------------------------------------------
      // CUSTOMER / USER
      // ------------------------------------------

      if (
        role === "USER" ||
        role === "CUSTOMER"
      ) {
        setUser(parsedUser);

        fetchBookings(
          parsedUser.userId
        );

        return;
      }

      // ------------------------------------------
      // INVALID ROLE
      // ------------------------------------------

      throw new Error(
        "Invalid account role"
      );

    } catch (error) {
      console.error(
        "User data error:",
        error
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "userId"
      );

      toast.error(
        "Session expired. Please login again."
      );

      navigate("/login", {
        state: {
          redirectTo:
            "/user/dashboard",
          loginType:
            "CUSTOMER"
        }
      });
    }
  }, [navigate]);

  // ==========================================
  // BOOKING STATISTICS
  // ==========================================

  const totalBookings =
    bookings.length;

  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking.status?.toUpperCase() ===
        "PENDING"
    ).length;

  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status?.toUpperCase() ===
        "COMPLETED"
    ).length;

  const availableServices =
    services.length;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading && !user) {
    return (
      <div className="dashboard-page">

        <div className="loading-box">

          <h2>
            Loading your dashboard...
          </h2>

        </div>

      </div>
    );
  }

  // ==========================================
  // USER NOT AVAILABLE
  // ==========================================

  if (!user) {
    return null;
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* ========================================
          WELCOME
      ======================================== */}

      <section className="dashboard-welcome">

        <div>

          <p className="welcome-label">
            Welcome back 👋
          </p>

          <h1>
            Hi,{" "}
            {user.fullName ||
              user.email}
          </h1>

          <p>
            Manage your services and bookings
            from your dashboard.
          </p>

        </div>

        <div className="dashboard-home-icon">
          🏠
        </div>

      </section>

      {/* ========================================
          STATISTICS
      ======================================== */}

      <section className="dashboard-stats">

        {/* TOTAL BOOKINGS */}

        <div className="stat-card">

          <div className="stat-icon">
            📋
          </div>

          <div>

            <h3>
              {totalBookings}
            </h3>

            <p>
              Total Bookings
            </p>

          </div>

        </div>

        {/* PENDING */}

        <div className="stat-card">

          <div className="stat-icon">
            ⏳
          </div>

          <div>

            <h3>
              {pendingBookings}
            </h3>

            <p>
              Pending Bookings
            </p>

          </div>

        </div>

        {/* COMPLETED */}

        <div className="stat-card">

          <div className="stat-icon">
            ✅
          </div>

          <div>

            <h3>
              {completedBookings}
            </h3>

            <p>
              Completed Bookings
            </p>

          </div>

        </div>

        {/* SERVICES */}

        <div className="stat-card">

          <div className="stat-icon">
            🛠️
          </div>

          <div>

            <h3>
              {availableServices}
            </h3>

            <p>
              Available Services
            </p>

          </div>

        </div>

      </section>

      {/* ========================================
          SERVICE PANEL
      ======================================== */}

      <section className="dashboard-section">

        <h2>
          Service Panel
        </h2>

        <p className="dashboard-description">
          Choose a service and book a professional
          at your convenient time.
        </p>

        <div className="quick-actions">

          {/* BOOK SERVICE */}

          <div
            className="action-card"
            onClick={() =>
              navigate("/services")
            }
          >

            <div className="action-icon">
              🔧
            </div>

            <h3>
              Book a Service
            </h3>

            <p>
              Find a professional and select
              your preferred date and time
              for the service.
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/services");
              }}
            >
              Book Now →
            </button>

          </div>

          {/* MY BOOKINGS */}

          <div
            className="action-card"
            onClick={() =>
              navigate("/my-bookings")
            }
          >

            <div className="action-icon">
              📅
            </div>

            <h3>
              My Bookings
            </h3>

            <p>
              View your upcoming, pending
              and completed service bookings.
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/my-bookings");
              }}
            >
              View Bookings →
            </button>

          </div>

        </div>

      </section>

      {/* ========================================
          AVAILABLE SERVICES
      ======================================== */}

      <section className="dashboard-section">

        <h2>
          Available Services
        </h2>

        <p className="dashboard-description">
          Select any service to continue
          with your booking.
        </p>

        <div className="home-service-list">

          {services.map(
            (service) => (
              <div
                className="home-service-card"
                key={service.id}
              >

                <span className="service-dashboard-icon">
                  {service.icon}
                </span>

                <h3>
                  {service.name}
                </h3>

                <p>
                  {service.description}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/services")
                  }
                >
                  Book
                </button>

              </div>
            )
          )}

        </div>

      </section>

      {/* ========================================
          RECENT BOOKINGS
      ======================================== */}

      <section className="dashboard-section">

        <div className="section-heading-row">

          <div>

            <h2>
              Recent Bookings
            </h2>

            <p className="dashboard-description">
              Your latest service bookings.
            </p>

          </div>

          <button
            type="button"
            className="view-all-btn"
            onClick={() =>
              navigate("/my-bookings")
            }
          >
            View All
          </button>

        </div>

        {bookings.length === 0 ? (

          <div className="no-bookings">

            <div className="no-bookings-icon">
              📋
            </div>

            <h3>
              No Bookings Yet
            </h3>

            <p>
              You haven't booked any service yet.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/services")
              }
            >
              Book a Service
            </button>

          </div>

        ) : (

          <div className="recent-bookings">

            {bookings
              .slice(0, 3)
              .map(
                (booking) => (
                  <div
                    className="recent-booking-card"
                    key={booking.id}
                  >

                    <div>

                      <h3>
                        {booking.serviceName}
                      </h3>

                      <p>
                        Booking ID: #{booking.id}
                      </p>

                    </div>

                    <div className="recent-booking-info">

                      <span>
                        📅 {booking.date}
                      </span>

                      <span>
                        ⏰ {booking.timeSlot}
                      </span>

                      <span
                        className={`booking-status ${
                          booking.status
                            ?.toLowerCase() || ""
                        }`}
                      >
                        {booking.status ||
                          "PENDING"}
                      </span>

                    </div>

                  </div>
                )
              )}

          </div>
        )}

      </section>

      {/* ========================================
          ACCOUNT INFORMATION
      ======================================== */}

      <section className="dashboard-section">

        <h2>
          Account Information
        </h2>

        <div className="account-card">

          <div className="account-item">

            <span>
              Name
            </span>

            <strong>
              {user.fullName ||
                "Not available"}
            </strong>

          </div>

          <div className="account-item">

            <span>
              Email
            </span>

            <strong>
              {user.email ||
                "Not available"}
            </strong>

          </div>

          <div className="account-item">

            <span>
              Phone Number
            </span>

            <strong>
              {user.phoneNumber ||
                "Not available"}
            </strong>

          </div>

          <div className="account-item">

            <span>
              Account Type
            </span>

            <strong>
              {user.role === "USER"
                ? "Customer"
                : user.role ||
                  "Customer"}
            </strong>

          </div>

        </div>

      </section>

      {/* ========================================
          BOTTOM CTA
      ======================================== */}

      <section className="dashboard-cta">

        <div>

          <h2>
            Need a professional?
          </h2>

          <p>
            Book a trusted professional for
            your home service today.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/services")
          }
        >
          Book a Service
        </button>

      </section>

    </div>
  );
}
