
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../CSS/Home.css";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  const getCurrentUser = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User data error:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("userId");

      return null;
    }
  };

  // =====================================================
  // APPLY FOR SERVICE
  // =====================================================

  const handleServiceClick = () => {
    const user = getCurrentUser();

    // -----------------------------------------
    // NOT LOGGED IN
    // -----------------------------------------

    if (!user) {
      navigate("/login", {
        state: {
          redirectTo: "/user/dashboard",
          loginType: "CUSTOMER"
        }
      });

      return;
    }

    const role = user.role?.toUpperCase();

    // -----------------------------------------
    // ADMIN
    // -----------------------------------------

    if (role === "ADMIN") {
      navigate("/admin");
      return;
    }

    // -----------------------------------------
    // JOB SEEKER
    // -----------------------------------------

    if (role === "JOB_SEEKER") {
      toast.warning(
        "This is a Job Seeker account. Please use a Customer account to apply for services."
      );

      return;
    }

    // -----------------------------------------
    // CUSTOMER / OLD USER
    // -----------------------------------------

    if (
      role === "CUSTOMER" ||
      role === "USER"
    ) {
      navigate("/user/dashboard");
      return;
    }

    // -----------------------------------------
    // UNKNOWN ROLE
    // -----------------------------------------

    toast.error(
      "Invalid account role. Please login again."
    );
  };

  // =====================================================
  // APPLY FOR JOB
  // =====================================================

  const handleJobClick = () => {
    const user = getCurrentUser();

    // -----------------------------------------
    // NOT LOGGED IN
    // -----------------------------------------

    if (!user) {
      navigate("/login", {
        state: {
          redirectTo: "/job-dashboard",
          loginType: "JOB_SEEKER"
        }
      });

      return;
    }

    const role = user.role?.toUpperCase();

    // -----------------------------------------
    // ADMIN
    // -----------------------------------------

    if (role === "ADMIN") {
      navigate("/admin");
      return;
    }

    // -----------------------------------------
    // CUSTOMER / OLD USER
    // -----------------------------------------

    if (
      role === "CUSTOMER" ||
      role === "USER"
    ) {
      toast.warning(
        "This is a Customer account. Please use a Job Seeker account to apply for jobs."
      );

      return;
    }

    // -----------------------------------------
    // JOB SEEKER
    // -----------------------------------------

    if (role === "JOB_SEEKER") {
      navigate("/job-dashboard");
      return;
    }

    // -----------------------------------------
    // UNKNOWN ROLE
    // -----------------------------------------

    toast.error(
      "Invalid account role. Please login again."
    );
  };

  return (
    <div className="home-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero-section">

        <div className="hero-content">

          <span className="hero-tag">
            WELCOME TO SERVICEBOOK
          </span>

          <h1>
            Services When You Need Them.
            <br />
            Jobs When You’re Looking for Them.
          </h1>

          <p>
            Book trusted professionals for your home or
            discover job opportunities and apply online.
          </p>

          <div className="hero-buttons">

            <button
              type="button"
              onClick={handleServiceClick}
              className="primary-btn"
            >
              🛠️ Apply for Service
            </button>

            <button
              type="button"
              onClick={handleJobClick}
              className="secondary-btn"
            >
              💼 Apply for Job
            </button>

          </div>

        </div>

        <div className="hero-icon">
          🏠
        </div>

      </section>


      {/* =====================================================
          MAIN CHOICE
      ===================================================== */}

      <section className="choice-section">

        <div className="choice-heading">

          <span>
            GET STARTED
          </span>

          <h2>
            What brings you here?
          </h2>

          <p>
            Choose what you need and we'll take you to
            the right place.
          </p>

        </div>


        <div className="choice-container">

          {/* =================================================
              SERVICE
          ================================================= */}

          <div className="choice-card service-choice">

            <div className="choice-top">

              <div className="choice-icon">
                🛠️
              </div>

              <span className="choice-badge">
                FOR CUSTOMERS
              </span>

            </div>

            <h3>
              I Need a Service
            </h3>

            <p>
              Need help at home? Find a professional and
              book a service at your preferred date and time.
            </p>

            <div className="choice-list">

              <div>
                ✓ Carpenter
              </div>

              <div>
                ✓ Electrician
              </div>

              <div>
                ✓ Plumber
              </div>

              <div>
                ✓ AC Repair
              </div>

              <div>
                ✓ Cleaning
              </div>

              <div>
                ✓ Painting
              </div>

            </div>

            <button
              type="button"
              className="choice-button service-button"
              onClick={handleServiceClick}
            >
              Apply for Service →
            </button>

          </div>


          {/* =================================================
              JOB
          ================================================= */}

          <div className="choice-card job-choice">

            <div className="choice-top">

              <div className="choice-icon">
                💼
              </div>

              <span className="choice-badge">
                FOR JOB SEEKERS
              </span>

            </div>

            <h3>
              I’m Looking for a Job
            </h3>

            <p>
              Looking for your next opportunity? Browse
              jobs, check requirements and apply online.
            </p>

            <div className="choice-list">

              <div>
                ✓ Browse Job Opportunities
              </div>

              <div>
                ✓ Check Job Details
              </div>

              <div>
                ✓ Apply Online
              </div>

              <div>
                ✓ Upload Resume
              </div>

              <div>
                ✓ Track Applications
              </div>

              <div>
                ✓ Manage Your Profile
              </div>

            </div>

            <button
              type="button"
              className="choice-button job-button"
              onClick={handleJobClick}
            >
              Apply for Job →
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW SERVICE BOOKING WORKS
      ===================================================== */}

      <section className="how-section">

        <div className="section-heading">

          <span>
            APPLY FOR SERVICE
          </span>

          <h2>
            Book a Professional in 4 Easy Steps
          </h2>

          <p>
            Getting help at home is simple.
          </p>

        </div>


        <div className="steps-container">

          {/* STEP 1 */}

          <div className="step-card">

            <div className="step-icon">
              🔍
            </div>

            <div className="step-number">
              01
            </div>

            <h3>
              Choose a Service
            </h3>

            <p>
              Select the home service you need.
            </p>

          </div>


          {/* STEP 2 */}

          <div className="step-card">

            <div className="step-icon">
              📅
            </div>

            <div className="step-number">
              02
            </div>

            <h3>
              Choose Date & Time
            </h3>

            <p>
              Select a convenient date and time slot.
            </p>

          </div>


          {/* STEP 3 */}

          <div className="step-card">

            <div className="step-icon">
              📍
            </div>

            <div className="step-number">
              03
            </div>

            <h3>
              Add Your Details
            </h3>

            <p>
              Enter your address and contact details.
            </p>

          </div>


          {/* STEP 4 */}

          <div className="step-card">

            <div className="step-icon">
              ✅
            </div>

            <div className="step-number">
              04
            </div>

            <h3>
              Confirm Booking
            </h3>

            <p>
              Get your booking details by email.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section className="home-services">

        <div className="section-heading">

          <span>
            OUR SERVICES
          </span>

          <h2>
            Popular Home Services
          </h2>

          <p>
            Professional help for your everyday needs.
          </p>

        </div>


        <div className="home-service-list">

          <div className="home-service-card">

            <span>
              🪚
            </span>

            <h3>
              Carpenter
            </h3>

            <p>
              Furniture repair and installation.
            </p>

          </div>


          <div className="home-service-card">

            <span>
              ⚡
            </span>

            <h3>
              Electrician
            </h3>

            <p>
              Electrical repair and installation.
            </p>

          </div>


          <div className="home-service-card">

            <span>
              🔧
            </span>

            <h3>
              Plumber
            </h3>

            <p>
              Pipe, tap and plumbing services.
            </p>

          </div>


          <div className="home-service-card">

            <span>
              ❄️
            </span>

            <h3>
              AC Repair
            </h3>

            <p>
              AC servicing and maintenance.
            </p>

          </div>

        </div>


        <button
          type="button"
          className="view-services-btn"
          onClick={() => navigate("/services")}
        >
          Explore All Services →
        </button>

      </section>


      {/* =====================================================
          JOB CTA
      ===================================================== */}

      <section className="job-banner">

        <div className="job-banner-icon">
          💼
        </div>

        <div className="job-banner-content">

          <span>
            LOOKING FOR WORK?
          </span>

          <h2>
            Your next opportunity could be here.
          </h2>

          <p>
            Explore available jobs, apply online and
            track your applications from your dashboard.
          </p>

        </div>

        <button
          type="button"
          onClick={handleJobClick}
        >
          Apply for Job →
        </button>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="cta-section">

        <h2>
          Ready to get started?
        </h2>

        <p>
          Choose the option that matches your needs.
        </p>

        <div className="cta-buttons">

          <button
            type="button"
            onClick={handleServiceClick}
          >
            🛠️ Apply for Service
          </button>

          <button
            type="button"
            onClick={handleJobClick}
          >
            💼 Apply for Job
          </button>

        </div>

      </section>

      <Footer/>

    </div>
  );
}