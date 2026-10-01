import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../CSS/MyBooking.css";

export default function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user) {
      toast.warning("Please login first");
      navigate("/login");
      return;
    }

    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:8080/api/bookings/user/${user.userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();

      // Latest booking first
      const sortedBookings = [...data].sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );

      setBookings(sortedBookings);

    } catch (error) {
      console.error("Fetch Bookings Error:", error);

      setError("Unable to load your bookings.");
      toast.error("Unable to load your bookings");

    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Not available";
    }

    const [year, month, day] = dateString.split("-");

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    return status
      ? status.toLowerCase()
      : "pending";
  };

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status?.toUpperCase() === "PENDING"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) =>
      booking.status?.toUpperCase() === "CONFIRMED"
  ).length;

  const completedBookings = bookings.filter(
    (booking) =>
      booking.status?.toUpperCase() === "COMPLETED"
  ).length;

  if (loading) {
    return (
      <div className="my-bookings-page">
        <div className="loading-card">
          <div className="loading-spinner"></div>

          <h2>Loading Your Bookings</h2>

          <p>
            Please wait while we fetch your booking details...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="my-bookings-page">

      {/* =========================
          PAGE HEADER
      ========================== */}
      <section className="my-bookings-hero">

        <div>
          <span className="hero-label">
            SERVICE BOOKING
          </span>

          <h1>
            My Bookings
          </h1>

          <p>
            Track and manage all your home service bookings
            in one place.
          </p>
        </div>

        <div className="hero-icon">
          📋
        </div>

      </section>


      {/* =========================
          USER SUMMARY
      ========================== */}
      <section className="booking-summary">

        <div className="summary-user">

          <div className="user-avatar">
            {user.fullName
              ? user.fullName.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div>
            <span>Welcome back</span>

            <h3>
              {user.fullName || user.email}
            </h3>

            <p>
              {user.email}
            </p>
          </div>

        </div>


        <div className="summary-stats">

          <div className="summary-stat">
            <strong>{totalBookings}</strong>
            <span>Total</span>
          </div>

          <div className="summary-stat">
            <strong>{pendingBookings}</strong>
            <span>Pending</span>
          </div>

          <div className="summary-stat">
            <strong>{confirmedBookings}</strong>
            <span>Confirmed</span>
          </div>

          <div className="summary-stat">
            <strong>{completedBookings}</strong>
            <span>Completed</span>
          </div>

        </div>

      </section>


      {/* =========================
          ERROR
      ========================== */}
      {error && (
        <div className="error-card">

          <div className="error-icon">
            ⚠️
          </div>

          <div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={fetchBookings}
          >
            Try Again
          </button>

        </div>
      )}


      {/* =========================
          NO BOOKINGS
      ========================== */}
      {!error && bookings.length === 0 ? (

        <div className="empty-bookings">

          <div className="empty-icon">
            📋
          </div>

          <h2>
            No Bookings Yet
          </h2>

          <p>
            You haven't booked any service yet.
            Choose a service and schedule your first booking.
          </p>

          <button
            type="button"
            onClick={() => navigate("/services")}
          >
            Browse Services →
          </button>

        </div>

      ) : (

        !error && (
          <section className="bookings-section">

            <div className="bookings-section-header">

              <div>
                <span>
                  YOUR ACTIVITY
                </span>

                <h2>
                  Recent & Previous Bookings
                </h2>
              </div>

              <button
                type="button"
                className="book-more-btn"
                onClick={() => navigate("/services")}
              >
                + Book Service
              </button>

            </div>


            <div className="bookings-container">

              {bookings.map((booking, index) => (

                <div
                  className={`booking-card ${
                    index === 0
                      ? "recent-booking"
                      : ""
                  }`}
                  key={booking.id}
                >

                  {/* Recent Badge */}
                  {index === 0 && (
                    <div className="recent-badge">
                      ⭐ Recent Booking
                    </div>
                  )}


                  {/* =========================
                      CARD HEADER
                  ========================== */}
                  <div className="booking-card-header">

                    <div className="booking-service">

                      <div className="service-icon-box">
                        🔧
                      </div>

                      <div>
                        <span className="booking-label">
                          SERVICE
                        </span>

                        <h2>
                          {booking.serviceName ||
                            "Service"}
                        </h2>

                        <p>
                          Booking ID #
                          {booking.id}
                        </p>
                      </div>

                    </div>


                    <span
                      className={`booking-status ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status || "PENDING"}
                    </span>

                  </div>


                  {/* =========================
                      DETAILS
                  ========================== */}
                  <div className="booking-details">

                    <div className="detail-box">

                      <div className="detail-icon">
                        📅
                      </div>

                      <div>
                        <span>Date</span>

                        <strong>
                          {formatDate(booking.date)}
                        </strong>
                      </div>

                    </div>


                    <div className="detail-box">

                      <div className="detail-icon">
                        ⏰
                      </div>

                      <div>
                        <span>Time Slot</span>

                        <strong>
                          {booking.timeSlot ||
                            "Not available"}
                        </strong>
                      </div>

                    </div>


                    <div className="detail-box">

                      <div className="detail-icon">
                        📞
                      </div>

                      <div>
                        <span>Phone</span>

                        <strong>
                          {booking.phoneNumber ||
                            "Not available"}
                        </strong>
                      </div>

                    </div>


                    <div className="detail-box">

                      <div className="detail-icon">
                        📧
                      </div>

                      <div>
                        <span>Email</span>

                        <strong>
                          {booking.userEmail ||
                            "Not available"}
                        </strong>
                      </div>

                    </div>


                    <div className="detail-box full-width">

                      <div className="detail-icon">
                        📍
                      </div>

                      <div>
                        <span>Service Address</span>

                        <strong>
                          {booking.address ||
                            "Not available"}
                        </strong>
                      </div>

                    </div>


                    {booking.notes && (
                      <div className="detail-box full-width">

                        <div className="detail-icon">
                          📝
                        </div>

                        <div>
                          <span>Additional Notes</span>

                          <strong>
                            {booking.notes}
                          </strong>
                        </div>

                      </div>
                    )}

                  </div>


                  {/* =========================
                      CARD FOOTER
                  ========================== */}
                  <div className="booking-card-footer">

                    <div className="email-confirmation">

                      <span className="footer-icon">
                        ✉️
                      </span>

                      <div>
                        <small>
                          Confirmation Email
                        </small>

                        <strong>
                          Sent to {booking.userEmail}
                        </strong>
                      </div>

                    </div>


                    <div className="booking-status-info">

                      <span>
                        Current Status
                      </span>

                      <strong
                        className={`footer-status ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status || "PENDING"}
                      </strong>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>
        )
      )}


      {/* =========================
          BOTTOM CTA
      ========================== */}
      <section className="booking-cta">

        <div>
          <span>
            NEED ANOTHER SERVICE?
          </span>

          <h2>
            Book a professional today.
          </h2>

          <p>
            Choose from our available home services
            and schedule a convenient time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/services")}
        >
          Browse Services →
        </button>

      </section>

    </div>
  );
}