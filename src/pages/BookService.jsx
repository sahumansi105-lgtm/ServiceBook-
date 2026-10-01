import {
  useLocation,
  useNavigate
} from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import "../CSS/BookService.css";

export default function BookService() {

  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // SELECTED SERVICE
  // =====================================================

  const service =
    location.state?.service;

  // =====================================================
  // CURRENT USER
  // =====================================================

  const storedUser =
    localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    user = null;
  }

  // =====================================================
  // BOOKING STATE
  // =====================================================

  const [booking, setBooking] = useState({
    date: "",
    timeSlot: "",
    address: "",
    phoneNumber:
      user?.phoneNumber || "",
    notes: ""
  });

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // NO SERVICE SELECTED
  // =====================================================

  if (!service) {
    return (
      <div className="booking-page">

        <div className="booking-card">

          <h2>
            No Service Selected
          </h2>

          <p>
            Please select a service first.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/services")
            }
          >
            Go to Services
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {

    let {
      name,
      value
    } = e.target;

    if (name === "phoneNumber") {
      value =
        value.replace(/\D/g, "");
    }

    setBooking((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =====================================================
  // SUBMIT BOOKING
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // ==========================================
    // LOGIN CHECK
    // ==========================================

    if (!user) {

      toast.warning(
        "Please login first"
      );

      navigate("/login", {
        state: {
          redirectTo: "/book-service",
          loginType: "CUSTOMER",
          service: service
        }
      });

      return;
    }

    // ==========================================
    // ROLE
    // ==========================================

    const role =
      user.role?.toUpperCase();

    // ==========================================
    // ADMIN
    // ==========================================

    if (role === "ADMIN") {
      navigate("/admin");
      return;
    }

    // ==========================================
    // JOB SEEKER
    // ==========================================

    if (role === "JOB_SEEKER") {

      toast.warning(
        "This is a Job Seeker account. Please use a Customer account for service booking."
      );

      navigate("/job-dashboard");

      return;
    }

    // ==========================================
    // CUSTOMER / OLD USER
    // ==========================================

    if (
      role !== "CUSTOMER" &&
      role !== "USER"
    ) {

      toast.error(
        "Invalid account role. Please login again."
      );

      localStorage.removeItem("user");
      localStorage.removeItem("userId");

      navigate("/login", {
        state: {
          redirectTo:
            "/book-service",
          loginType:
            "CUSTOMER",
          service:
            service
        }
      });

      return;
    }

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !booking.date ||
      !booking.timeSlot ||
      !booking.address.trim() ||
      !booking.phoneNumber.trim()
    ) {

      toast.warning(
        "Please fill all required fields"
      );

      return;
    }

    if (
      !/^[0-9]{10}$/.test(
        booking.phoneNumber
      )
    ) {

      toast.warning(
        "Phone number must be exactly 10 digits"
      );

      return;
    }

    // ==========================================
    // API REQUEST
    // ==========================================

    try {

      setLoading(true);

      const response =
        await fetch(
          "http://localhost:8080/api/bookings",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                userId:
                  user.userId,

                userEmail:
                  user.email,

                serviceName:
                  service.name,

                date:
                  booking.date,

                timeSlot:
                  booking.timeSlot,

                address:
                  booking.address.trim(),

                phoneNumber:
                  booking.phoneNumber,

                notes:
                  booking.notes.trim()
              })
          }
        );

      if (!response.ok) {

        const errorMessage =
          await response.text();

        throw new Error(
          errorMessage ||
          "Booking failed"
        );
      }

      const savedBooking =
        await response.json();

      console.log(
        "Booking saved:",
        savedBooking
      );

      toast.success(
        "Booking Successful 🎉"
      );

      navigate(
        "/my-bookings"
      );

    } catch (error) {

      console.error(
        "Booking Error:",
        error
      );

      toast.error(
        error.message ||
        "Something went wrong while booking"
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="booking-page">

      <div className="booking-card">

        <h1>
          Book Service
        </h1>

        {/* SELECTED SERVICE */}

        <div className="selected-service">

          <div className="selected-service-icon">
            {service.icon}
          </div>

          <div>

            <h2>
              {service.name}
            </h2>

            <p>
              {service.description}
            </p>

            <strong>
              {service.price}
            </strong>

          </div>

        </div>

        {/* BOOKING FORM */}

        <form
          onSubmit={handleSubmit}
        >

          {/* SERVICE */}

          <div className="form-group">

            <label>
              Service
            </label>

            <input
              type="text"
              value={service.name}
              readOnly
            />

          </div>

          {/* DATE */}

          <div className="form-group">

            <label>
              Select Date *
            </label>

            <input
              type="date"
              name="date"
              value={booking.date}
              onChange={handleChange}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
            />

          </div>

          {/* TIME SLOT */}

          <div className="form-group">

            <label>
              Select Time Slot *
            </label>

            <select
              name="timeSlot"
              value={booking.timeSlot}
              onChange={handleChange}
            >

              <option value="">
                Select Time Slot
              </option>

              <option value="09:00 AM - 11:00 AM">
                09:00 AM - 11:00 AM
              </option>

              <option value="11:00 AM - 01:00 PM">
                11:00 AM - 01:00 PM
              </option>

              <option value="02:00 PM - 04:00 PM">
                02:00 PM - 04:00 PM
              </option>

              <option value="04:00 PM - 06:00 PM">
                04:00 PM - 06:00 PM
              </option>

              <option value="06:00 PM - 08:00 PM">
                06:00 PM - 08:00 PM
              </option>

            </select>

          </div>

          {/* ADDRESS */}

          <div className="form-group">

            <label>
              Address *
            </label>

            <textarea
              name="address"
              placeholder="Enter your complete address"
              value={booking.address}
              onChange={handleChange}
              rows="4"
            />

          </div>

          {/* PHONE */}

          <div className="form-group">

            <label>
              Phone Number *
            </label>

            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter phone number"
              maxLength="10"
              value={booking.phoneNumber}
              onChange={handleChange}
              autoComplete="tel"
            />

          </div>

          {/* NOTES */}

          <div className="form-group">

            <label>
              Additional Notes
            </label>

            <textarea
              name="notes"
              placeholder="Any additional information..."
              value={booking.notes}
              onChange={handleChange}
              rows="3"
            />

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="confirm-booking-btn"
            disabled={loading}
          >
            {loading
              ? "Booking..."
              : "Confirm Booking"}
          </button>

        </form>

      </div>

    </div>
  );
}
